#!/usr/bin/env python3
"""Build the five-state LCYB regulatory-model figures.

The numerical values in this script are a dimensionally consistent illustrative
parameter set. They are used to expose the behaviour of the equations and are
not presented as measurements from the engineered D. salina strain.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch, Polygon


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "figures" / "dry-lab"
SUMMARY = ROOT / "public" / "data" / "regulatory-model-scenarios.json"

INK = "#123b32"
MUTED = "#60756c"
GRID = "#d9e3dc"
PAPER = "#fbfaf3"
PURPLE = "#b9a0ee"
CYAN = "#73c9d0"
YELLOW = "#f4c752"
LIME = "#a8d765"
ORANGE = "#ef7c4d"

mpl.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 10,
    "axes.labelcolor": INK,
    "axes.edgecolor": GRID,
    "axes.titlecolor": INK,
    "xtick.color": MUTED,
    "ytick.color": MUTED,
    "text.color": INK,
    "axes.facecolor": PAPER,
    "figure.facecolor": PAPER,
    "savefig.facecolor": PAPER,
    "savefig.bbox": "tight",
})


BASE = {
    "delta_T": 0.45,
    "mu": 0.08,
    "Kd": 1.00,
    "u_unbound": 0.40,
    "u_bound": 1.60,
    "delta_m": 0.65,
    "k_tl": 0.55,
    "delta_E": 0.18,
    "v_supply": 0.80,
    "q_LCYB": 0.50,
    "Km_LCYB": 0.70,
    "k_L": 0.08,
    "V_out": 0.55,
    "Km_out": 0.50,
    "k_B": 0.06,
}

SCENARIOS = {
    "Low input": 0.053,
    "Intermediate input": 0.530,
    "High input": 5.300,
}

SCENARIO_COLORS = {
    "Low input": MUTED,
    "Intermediate input": ORANGE,
    "High input": "#8b66d8",
}


def rates(state: np.ndarray, p: dict[str, float], s_t: float) -> tuple[float, float, float, float]:
    t, _m, e, l, b = state
    theta = t / (p["Kd"] + t)
    u = p["u_unbound"] * (1.0 - theta) + p["u_bound"] * theta
    v_lcyb = p["q_LCYB"] * e * l / (p["Km_LCYB"] + l)
    v_out = p["V_out"] * b / (p["Km_out"] + b)
    return theta, u, v_lcyb, v_out


def rhs(state: np.ndarray, p: dict[str, float], s_t: float) -> np.ndarray:
    t, m, e, l, b = state
    _theta, u, v_lcyb, v_out = rates(state, p, s_t)
    return np.array([
        s_t - (p["delta_T"] + p["mu"]) * t,
        u - (p["delta_m"] + p["mu"]) * m,
        p["k_tl"] * m - (p["delta_E"] + p["mu"]) * e,
        p["v_supply"] - v_lcyb - (p["k_L"] + p["mu"]) * l,
        v_lcyb - v_out - (p["k_B"] + p["mu"]) * b,
    ])


def rk4(initial: np.ndarray, p: dict[str, float], s_t: float, duration: float, dt: float = 0.01) -> tuple[np.ndarray, np.ndarray]:
    times = np.arange(0.0, duration + dt / 2.0, dt)
    values = np.zeros((len(times), 5), dtype=float)
    values[0] = initial
    for index in range(1, len(times)):
        y = values[index - 1]
        k1 = rhs(y, p, s_t)
        k2 = rhs(y + 0.5 * dt * k1, p, s_t)
        k3 = rhs(y + 0.5 * dt * k2, p, s_t)
        k4 = rhs(y + dt * k3, p, s_t)
        values[index] = np.maximum(y + dt * (k1 + 2 * k2 + 2 * k3 + k4) / 6.0, 0.0)
    return times, values


def equilibrium(p: dict[str, float], s_t: float) -> np.ndarray:
    _, values = rk4(np.array([0.1, 0.5, 1.0, 1.0, 1.0]), p, s_t, 160.0, 0.02)
    return values[-1]


def save(fig: plt.Figure, stem: str) -> None:
    for suffix, kwargs in ((".png", {"dpi": 180}), (".svg", {})):
        target = OUT / f"{stem}{suffix}"
        fig.savefig(target, **kwargs)
        if suffix == ".svg":
            cleaned = "\n".join(line.rstrip() for line in target.read_text(encoding="utf-8").splitlines()) + "\n"
            target.write_text(cleaned, encoding="utf-8")
    plt.close(fig)


def add_arrow(ax: plt.Axes, start: tuple[float, float], end: tuple[float, float], color: str = INK, width: float = 2.0, style: str = "-|>") -> None:
    ax.add_patch(FancyArrowPatch(start, end, arrowstyle=style, mutation_scale=13, linewidth=width, color=color, shrinkA=2, shrinkB=2))


def rounded(ax: plt.Axes, xy: tuple[float, float], width: float, height: float, color: str, title: str, subtitle: str, symbol: str | None = None) -> None:
    x, y = xy
    ax.add_patch(FancyBboxPatch((x, y), width, height, boxstyle="round,pad=0.016,rounding_size=0.025", facecolor=color, edgecolor=INK, linewidth=1.7))
    if symbol:
        ax.text(x + width * 0.16, y + height * 0.57, symbol, ha="center", va="center", fontsize=20, fontweight="bold")
        text_x = x + width * 0.30
        ha = "left"
    else:
        text_x = x + width / 2
        ha = "center"
    ax.text(text_x, y + height * 0.61, title, ha=ha, va="center", fontsize=12, fontweight="bold")
    ax.text(text_x, y + height * 0.33, subtitle, ha=ha, va="center", fontsize=9.5, color=MUTED)


def figure_architecture() -> None:
    fig, ax = plt.subplots(figsize=(15.6, 6.7))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    ax.text(0.03, 0.94, "REGULATORY INPUT", fontsize=11, fontweight="bold")
    ax.text(0.38, 0.94, "EXPRESSION", fontsize=11, fontweight="bold")
    ax.text(0.72, 0.94, "CAROTENOID CONVERSION", fontsize=11, fontweight="bold")
    ax.plot([0.03, 0.31], [0.905, 0.905], color=PURPLE, lw=5, solid_capstyle="round")
    ax.plot([0.38, 0.64], [0.905, 0.905], color=CYAN, lw=5, solid_capstyle="round")
    ax.plot([0.72, 0.97], [0.905, 0.905], color=LIME, lw=5, solid_capstyle="round")

    # Production and active regulator.
    ax.text(0.025, 0.67, r"$s_T$", fontsize=14, fontweight="bold")
    add_arrow(ax, (0.065, 0.68), (0.11, 0.68), PURPLE)
    ax.add_patch(Circle((0.16, 0.68), 0.054, facecolor=PURPLE, edgecolor=INK, lw=1.8))
    ax.text(0.16, 0.69, r"$T$", ha="center", va="center", fontsize=19, fontweight="bold")
    ax.text(0.16, 0.585, "active regulator", ha="center", fontsize=9.5, color=MUTED)
    ax.text(0.16, 0.53, r"loss $(\delta_T+\mu)T$", ha="center", fontsize=9, color=MUTED)
    add_arrow(ax, (0.16, 0.62), (0.16, 0.56), MUTED, 1.3)

    # Promoter occupancy.
    add_arrow(ax, (0.215, 0.68), (0.275, 0.68), INK)
    ax.text(0.245, 0.80, "binding", ha="center", fontsize=9, color=MUTED)
    ax.add_patch(FancyBboxPatch((0.28, 0.60), 0.18, 0.16, boxstyle="round,pad=0.016,rounding_size=0.025", facecolor="#eee9fb", edgecolor=INK, linewidth=1.7))
    ax.text(0.37, 0.708, "LCYB promoter", ha="center", va="center", fontsize=12, fontweight="bold")
    ax.text(0.37, 0.651, r"occupancy  $\theta=T/(K_d+T)$", ha="center", va="center", fontsize=9.5, color=MUTED)
    ax.plot([0.315, 0.425], [0.622, 0.622], color=INK, lw=1.8)
    for x in np.linspace(0.322, 0.414, 6):
        ax.plot([x, x + 0.008], [0.613, 0.631], color=PURPLE, lw=1.1)

    # Transcript and protein.
    add_arrow(ax, (0.46, 0.68), (0.49, 0.68), INK)
    ax.text(0.475, 0.80, "transcription", ha="center", fontsize=9, color=MUTED)
    rounded(ax, (0.495, 0.61), 0.13, 0.14, "#dff4f2", "LCYB RNA", r"state $m$", "m")
    ax.text(0.56, 0.53, r"loss $(\delta_m+\mu)m$", ha="center", fontsize=9, color=MUTED)
    add_arrow(ax, (0.56, 0.61), (0.56, 0.56), MUTED, 1.3)
    add_arrow(ax, (0.625, 0.68), (0.65, 0.68), INK)
    ax.text(0.638, 0.80, "translation", ha="center", fontsize=9, color=MUTED)
    ax.add_patch(Circle((0.69, 0.68), 0.048, facecolor=CYAN, edgecolor=INK, lw=1.8))
    ax.text(0.69, 0.69, r"$E$", ha="center", va="center", fontsize=19, fontweight="bold")
    ax.text(0.69, 0.585, "active LCYB", ha="center", fontsize=9.5, color=MUTED)
    ax.text(0.69, 0.53, r"loss $(\delta_E+\mu)E$", ha="center", fontsize=9, color=MUTED)
    add_arrow(ax, (0.69, 0.63), (0.69, 0.56), MUTED, 1.3)

    # Metabolite pools and enzyme-mediated reaction.
    ax.text(0.735, 0.79, r"$v_{supply}$", fontsize=10, color=MUTED)
    add_arrow(ax, (0.76, 0.77), (0.78, 0.72), YELLOW, 2)
    ax.add_patch(Circle((0.80, 0.68), 0.048, facecolor=YELLOW, edgecolor=INK, lw=1.8))
    ax.text(0.80, 0.69, r"$L$", ha="center", va="center", fontsize=19, fontweight="bold")
    ax.text(0.80, 0.585, "lycopene", ha="center", fontsize=9.5, color=MUTED)
    add_arrow(ax, (0.848, 0.68), (0.895, 0.68), INK)
    ax.text(0.871, 0.755, r"$v_{LCYB}$", ha="center", fontsize=10, fontweight="bold")
    ax.text(0.871, 0.615, r"$q_{LCYB}E\,L/(K_m+L)$", ha="center", fontsize=8.2, color=MUTED)
    ax.add_patch(Circle((0.94, 0.68), 0.048, facecolor=LIME, edgecolor=INK, lw=1.8))
    ax.text(0.94, 0.69, r"$B$", ha="center", va="center", fontsize=19, fontweight="bold")
    ax.text(0.94, 0.585, r"$\beta$-carotene", ha="center", fontsize=9.5, color=MUTED)
    ax.add_patch(FancyArrowPatch((0.69, 0.63), (0.872, 0.66), arrowstyle="-|>", mutation_scale=12, linewidth=1.5, linestyle="--", color=CYAN, connectionstyle="arc3,rad=0.28"))
    ax.text(0.80, 0.475, r"enzyme abundance scales $v_{LCYB}$", ha="center", fontsize=9, color=MUTED)
    add_arrow(ax, (0.94, 0.63), (0.94, 0.55), MUTED, 1.3)
    ax.text(0.94, 0.52, r"outflow + $(k_B+\mu)B$", ha="center", fontsize=8.8, color=MUTED)

    # Measurement handoff.
    ax.plot([0.03, 0.97], [0.39, 0.39], color=GRID, lw=1.4)
    ax.text(0.03, 0.335, "MATCHED MEASUREMENTS NEEDED TO CALIBRATE THE CHAIN", fontsize=10.5, fontweight="bold")
    measurements = [
        (0.03, 0.105, 0.205, "01", "Regulator", "abundance + binding"),
        (0.255, 0.105, 0.205, "02", "Transcript", "LCYB RNA time course"),
        (0.48, 0.105, 0.205, "03", "Active enzyme", "protein + activity"),
        (0.705, 0.105, 0.265, "04", "Pigment pools", "lycopene + β-carotene"),
    ]
    for x, y, width, number, title, detail in measurements:
        ax.add_patch(FancyBboxPatch((x, y), width, 0.15, boxstyle="round,pad=0.012,rounding_size=0.018", facecolor="#f2f5ef", edgecolor=GRID, linewidth=1.2))
        ax.text(x + 0.018, y + 0.102, number, fontsize=9.5, fontweight="bold", color=ORANGE)
        ax.text(x + 0.06, y + 0.102, title, fontsize=10.5, fontweight="bold")
        ax.text(x + 0.06, y + 0.052, detail, fontsize=9, color=MUTED)

    save(fig, "14_regulatory_model")


def figure_transfer() -> None:
    x = np.logspace(-2, 2, 500)
    theta = x / (1.0 + x)
    fig, axes = plt.subplots(1, 2, figsize=(15.6, 6.7), gridspec_kw={"wspace": 0.28})

    ax = axes[0]
    ax.plot(x, theta, color="#8b66d8", lw=4)
    ax.fill_between(x, 0, theta, color=PURPLE, alpha=0.18)
    ax.axvline(1, color=GRID, ls="--", lw=1.4)
    ax.axhline(0.5, color=GRID, ls="--", lw=1.4)
    for level in (0.1, 1.0, 10.0):
        value = level / (1 + level)
        ax.scatter([level], [value], s=60, facecolor=PAPER, edgecolor=INK, lw=1.5, zorder=3)
        ax.text(level, value + 0.055, f"{value:.0%}", ha="center", color=MUTED)
    ax.set_xscale("log")
    ax.set_xlim(1e-2, 1e2)
    ax.set_ylim(0, 1.04)
    ax.set_xlabel(r"Active regulator relative to affinity,  $T/K_d$")
    ax.set_ylabel(r"Promoter occupancy,  $\theta$")
    ax.set_title("A   Promoter occupancy", loc="left", fontsize=16, fontweight="bold")
    ax.text(0.03, 0.88, r"$\theta=T/(K_d+T)$", transform=ax.transAxes, fontsize=12, color=MUTED)

    ax = axes[1]
    for ratio, color in ((0.5, CYAN), (2.0, ORANGE), (4.0, "#8b66d8")):
        response = 1 + (ratio - 1) * theta
        ax.plot(x, response, color=color, lw=3, label=rf"$u_{{bound}}/u_{{unbound}}={ratio:g}$")
    ax.axhline(1, color=INK, lw=1.3, alpha=0.7)
    ax.axvline(1, color=GRID, ls="--", lw=1.4)
    ax.set_xscale("log")
    ax.set_xlim(1e-2, 1e2)
    ax.set_ylim(0.42, 4.05)
    ax.set_xlabel(r"Active regulator relative to affinity,  $T/K_d$")
    ax.set_ylabel("Relative transcript and active enzyme")
    ax.set_title("B   Steady-state expression transfer", loc="left", fontsize=16, fontweight="bold")
    ax.legend(frameon=False, loc="upper left")
    ax.text(0.03, 0.08, "Activation saturates once the promoter is mostly occupied.", transform=ax.transAxes, color=MUTED)

    for ax in axes:
        ax.spines[["top", "right"]].set_visible(False)
        ax.grid(axis="y", color=GRID, lw=0.8, alpha=0.7)
    save(fig, "15_regulatory_response")


def build_scenarios() -> tuple[np.ndarray, dict[str, np.ndarray], np.ndarray]:
    low_equilibrium = equilibrium(BASE, SCENARIOS["Low input"])
    traces: dict[str, np.ndarray] = {}
    times = np.array([])
    for label, s_t in SCENARIOS.items():
        times, values = rk4(low_equilibrium, BASE, s_t, 12.0)
        traces[label] = values
    return times, traces, low_equilibrium


def figure_dynamics(times: np.ndarray, traces: dict[str, np.ndarray], baseline: np.ndarray) -> None:
    state_panels = [
        (0, r"Regulator  $T/T_0$"),
        (1, r"LCYB transcript  $m/m_0$"),
        (2, r"Active LCYB  $E/E_0$"),
        (3, r"Lycopene  $L/L_0$"),
        (4, r"β-carotene  $B/B_0$"),
    ]
    fig, axes = plt.subplots(2, 3, figsize=(15.6, 8.0), sharex=True, gridspec_kw={"hspace": 0.36, "wspace": 0.28})
    axes = axes.ravel()
    for panel, (state_index, title) in enumerate(state_panels):
        ax = axes[panel]
        for label, values in traces.items():
            ax.plot(times, values[:, state_index] / baseline[state_index], color=SCENARIO_COLORS[label], lw=2.5, label=label)
        ax.axhline(1, color=GRID, lw=1)
        ax.set_title(f"{chr(65 + panel)}   {title}", loc="left", fontsize=12.5, fontweight="bold")
        ax.set_ylabel("Relative level")
        ax.grid(axis="y", color=GRID, lw=0.7)
        if state_index == 0:
            ax.set_yscale("log")
            ax.set_ylim(0.85, 125)
            ax.set_yticks([1, 10, 100], ["1", "10", "100"])

    ax = axes[5]
    baseline_flux = rates(baseline, BASE, SCENARIOS["Low input"])[2]
    for label, values in traces.items():
        flux = np.array([rates(row, BASE, SCENARIOS[label])[2] for row in values])
        ax.plot(times, flux / baseline_flux, color=SCENARIO_COLORS[label], lw=2.5, label=label)
    ax.axhline(1, color=GRID, lw=1)
    ax.set_title(r"F   LCYB flux  $v_{LCYB}/v_0$", loc="left", fontsize=12.5, fontweight="bold")
    ax.set_ylabel("Relative rate")
    ax.grid(axis="y", color=GRID, lw=0.7)

    for ax in axes:
        ax.set_xlabel("Time after regulator-input step (d)")
        ax.spines[["top", "right"]].set_visible(False)
    handles, labels = axes[0].get_legend_handles_labels()
    fig.legend(handles, labels, loc="upper center", ncol=3, frameon=False, bbox_to_anchor=(0.5, 1.015))
    fig.text(0.01, 0.01, "All trajectories start from the same low-input equilibrium and use the illustrative parameter set.", color=MUTED, fontsize=9)
    save(fig, "16_regulatory_dynamics")


def figure_sweep() -> None:
    ratios = np.logspace(-2, 2, 90)
    states = np.array([equilibrium(BASE, ratio * (BASE["delta_T"] + BASE["mu"]) * BASE["Kd"]) for ratio in ratios])
    low = states[0]
    fluxes = np.array([rates(row, BASE, ratios[i] * (BASE["delta_T"] + BASE["mu"]) * BASE["Kd"])[2] for i, row in enumerate(states)])
    baseline_flux = fluxes[0]

    fig, axes = plt.subplots(2, 2, figsize=(15.6, 8.0), sharex=True, gridspec_kw={"hspace": 0.34, "wspace": 0.26})
    series = [
        (states[:, 1] / low[1], "A   LCYB transcript", CYAN),
        (states[:, 2] / low[2], "B   Active LCYB", "#3ca9b5"),
        (fluxes / baseline_flux, "C   LCYB flux", ORANGE),
        (states[:, 4] / low[4], "D   β-carotene pool", LIME),
    ]
    for ax, (values, title, color) in zip(axes.ravel(), series):
        ax.plot(ratios, values, color=color, lw=3)
        ax.fill_between(ratios, 1, values, color=color, alpha=0.12)
        ax.axvline(1, color=GRID, ls="--", lw=1.3)
        ax.axhline(1, color=GRID, lw=1)
        ax.set_xscale("log")
        ax.set_xlim(1e-2, 1e2)
        ax.set_ylabel("Relative steady state")
        ax.set_title(title, loc="left", fontsize=13, fontweight="bold")
        ax.grid(axis="y", color=GRID, lw=0.7)
        ax.spines[["top", "right"]].set_visible(False)
    for ax in axes[1]:
        ax.set_xlabel(r"Steady regulator level relative to affinity,  $T^*/K_d$")
    fig.text(0.01, 0.01, "Values are normalized to the lowest simulated regulator input; curves are illustrative model scenarios, not measured fold changes.", color=MUTED, fontsize=9)
    save(fig, "17_regulatory_sweep")


def sensitivity() -> list[dict[str, float | str]]:
    initial = equilibrium(BASE, SCENARIOS["Low input"])
    central_input = SCENARIOS["Intermediate input"]
    _, central_values = rk4(initial, BASE, central_input, 12.0)
    central_b = central_values[-1, 4]
    parameters = ["s_T", "Kd", "u_bound", "delta_m", "k_tl", "delta_E", "v_supply", "q_LCYB", "Km_LCYB", "V_out", "k_B", "mu"]
    output = []
    for name in parameters:
        if name == "s_T":
            plus_input = central_input * 1.1
            minus_input = central_input * 0.9
            _, plus_values = rk4(initial, BASE, plus_input, 12.0)
            _, minus_values = rk4(initial, BASE, minus_input, 12.0)
        else:
            plus = dict(BASE)
            minus = dict(BASE)
            plus[name] *= 1.1
            minus[name] *= 0.9
            _, plus_values = rk4(initial, plus, central_input, 12.0)
            _, minus_values = rk4(initial, minus, central_input, 12.0)
        elasticity = (np.log(plus_values[-1, 4]) - np.log(minus_values[-1, 4])) / (np.log(1.1) - np.log(0.9))
        output.append({"parameter": name, "elasticity": float(elasticity), "central_B": float(central_b)})
    return sorted(output, key=lambda item: abs(float(item["elasticity"])), reverse=True)


def figure_sensitivity(results: list[dict[str, float | str]]) -> None:
    labels = [str(item["parameter"]) for item in results][::-1]
    values = np.array([float(item["elasticity"]) for item in results][::-1])
    display = {
        "s_T": r"Regulator production  $s_T$",
        "Kd": r"Binding constant  $K_d$",
        "u_bound": r"Bound transcription  $u_{bound}$",
        "delta_m": r"RNA decay  $\delta_m$",
        "k_tl": r"Translation  $k_{tl}$",
        "delta_E": r"Enzyme decay  $\delta_E$",
        "v_supply": r"Lycopene supply  $v_{supply}$",
        "q_LCYB": r"Catalytic capacity  $q_{LCYB}$",
        "Km_LCYB": r"Substrate constant  $K_{m,LCYB}$",
        "V_out": r"Downstream capacity  $V_{out}$",
        "k_B": r"β-carotene loss  $k_B$",
        "mu": r"Growth dilution  $\mu$",
    }
    colors = [ORANGE if value > 0 else CYAN for value in values]
    fig, ax = plt.subplots(figsize=(12.8, 7.5))
    positions = np.arange(len(values))
    ax.barh(positions, values, color=colors, height=0.68)
    ax.axvline(0, color=INK, lw=1.2)
    ax.set_yticks(positions, [display[label] for label in labels])
    ax.set_xlabel(r"Normalized local sensitivity of $B(12\,d)$")
    ax.set_title("β-carotene sensitivity around the intermediate-input scenario", loc="left", fontsize=16, fontweight="bold", pad=18)
    ax.text(0.0, 1.01, "Central finite difference · ±10% parameter perturbation · illustrative parameter set", transform=ax.transAxes, color=MUTED, fontsize=10)
    ax.grid(axis="x", color=GRID, lw=0.8)
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.tick_params(axis="y", length=0)
    for y, value in zip(positions, values):
        ax.text(value + (0.018 if value >= 0 else -0.018), y, f"{value:+.2f}", va="center", ha="left" if value >= 0 else "right", fontsize=9, color=INK)
    save(fig, "18_regulatory_sensitivity")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    SUMMARY.parent.mkdir(parents=True, exist_ok=True)
    figure_architecture()
    figure_transfer()
    times, traces, baseline = build_scenarios()
    figure_dynamics(times, traces, baseline)
    figure_sweep()
    sensitivity_results = sensitivity()
    figure_sensitivity(sensitivity_results)

    baseline_flux = rates(baseline, BASE, SCENARIOS["Low input"])[2]
    endpoints = {}
    for label, values in traces.items():
        endpoint = values[-1]
        endpoints[label] = {
            "T_over_low": float(endpoint[0] / baseline[0]),
            "m_over_low": float(endpoint[1] / baseline[1]),
            "E_over_low": float(endpoint[2] / baseline[2]),
            "L_over_low": float(endpoint[3] / baseline[3]),
            "B_over_low": float(endpoint[4] / baseline[4]),
            "v_LCYB_over_low": float(rates(endpoint, BASE, SCENARIOS[label])[2] / baseline_flux),
        }

    summary = {
        "scope": "Illustrative five-state LCYB regulatory-model scenarios; not project measurements",
        "solver": {"method": "fixed-step classical RK4", "step_days": 0.01, "duration_days": 12.0},
        "initial_condition": "Equilibrium under the low regulator-production input",
        "parameters": BASE,
        "regulator_production_scenarios": SCENARIOS,
        "day_12_endpoints_relative_to_low_equilibrium": endpoints,
        "sensitivity": sensitivity_results,
        "figure_sha256": {
            path.name: hashlib.sha256(path.read_bytes()).hexdigest()
            for path in sorted(OUT.glob("1[4-8]_regulatory_*.png"))
        },
    }
    SUMMARY.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
