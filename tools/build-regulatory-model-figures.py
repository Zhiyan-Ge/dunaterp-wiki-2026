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
from matplotlib.colors import TwoSlopeNorm


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
    "svg.hashsalt": "dunaterp-regulatory-model",
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
    for suffix, kwargs in ((".png", {"dpi": 180}), (".svg", {"metadata": {"Date": None}})):
        target = OUT / f"{stem}{suffix}"
        fig.savefig(target, **kwargs)
        if suffix == ".svg":
            cleaned = "\n".join(line.rstrip() for line in target.read_text(encoding="utf-8").splitlines()) + "\n"
            target.write_text(cleaned, encoding="utf-8")
    plt.close(fig)


def time_to_fraction(times: np.ndarray, values: np.ndarray, fraction: float = 0.9) -> float:
    initial = values[0]
    final = values[-1]
    if np.isclose(initial, final):
        return float("nan")
    target = initial + fraction * (final - initial)
    reached = np.flatnonzero(values >= target) if final > initial else np.flatnonzero(values <= target)
    return float(times[reached[0]]) if len(reached) else float("nan")


def figure_diagnostics(times: np.ndarray, traces: dict[str, np.ndarray], baseline: np.ndarray) -> None:
    """Summarise response magnitude, response time and numerical convergence."""
    fig = plt.figure(figsize=(15.6, 5.8))
    grid = fig.add_gridspec(1, 3, width_ratios=(1.45, 1.0, 1.0), wspace=0.38)
    fig.suptitle("MODEL DIAGNOSTICS · RESPONSE MAGNITUDE, TIMING AND NUMERICAL RELIABILITY", x=0.025, y=0.98, ha="left", fontsize=15, fontweight="bold")
    fig.text(0.025, 0.925, "Illustrative scenarios · all endpoint gains are relative to the low-input equilibrium", color=MUTED, fontsize=10)

    # A — endpoint response matrix.
    ax = fig.add_subplot(grid[0, 0])
    baseline_flux = rates(baseline, BASE, SCENARIOS["Low input"])[2]
    endpoint_folds = []
    for label, values in traces.items():
        endpoint = values[-1]
        flux_fold = rates(endpoint, BASE, SCENARIOS[label])[2] / baseline_flux
        endpoint_folds.append([*(endpoint / baseline), flux_fold])
    endpoint_folds = np.asarray(endpoint_folds)
    log_folds = np.log10(endpoint_folds)
    image = ax.imshow(log_folds, cmap="PuOr_r", norm=TwoSlopeNorm(vmin=-0.7, vcenter=0.0, vmax=2.05), aspect="auto")
    ax.set_xticks(np.arange(6), [r"$T$", r"$m$", r"$E$", r"$L$", r"$B$", r"$v_{LCYB}$"])
    ax.set_yticks(np.arange(3), ["Low", "Intermediate", "High"])
    ax.set_title("A   Day-12 endpoint gain", loc="left", fontsize=12.5, fontweight="bold", pad=14)
    for row in range(endpoint_folds.shape[0]):
        for column in range(endpoint_folds.shape[1]):
            value = endpoint_folds[row, column]
            text_color = "white" if abs(log_folds[row, column]) > 1.15 else INK
            if value >= 10:
                value_label = f"×{value:.0f}"
            elif value >= 1:
                value_label = f"×{value:.1f}".replace(".0", "")
            else:
                value_label = f"×{value:.2f}"
            ax.text(column, row, value_label, ha="center", va="center", fontsize=9, fontweight="bold", color=text_color)
    colorbar = fig.colorbar(image, ax=ax, fraction=0.048, pad=0.03)
    colorbar.set_label(r"$\log_{10}$(fold change)", color=MUTED)
    colorbar.ax.tick_params(labelsize=8)
    ax.tick_params(length=0)
    ax.spines[:].set_visible(False)

    # B — time needed to complete 90% of the simulated day-12 response.
    ax = fig.add_subplot(grid[0, 1])
    state_indices = (0, 1, 2, 3, 4)
    state_labels = [r"Regulator  $T$", r"Transcript  $m$", r"Enzyme  $E$", r"Lycopene  $L$", r"β-carotene  $B$"]
    positions = np.arange(len(state_indices))
    height = 0.34
    for offset, (label, color) in zip((-height / 2, height / 2), (("Intermediate input", ORANGE), ("High input", "#8b66d8"))):
        response_times = [time_to_fraction(times, traces[label][:, index]) for index in state_indices]
        ax.barh(positions + offset, response_times, height=height, color=color, label=label.replace(" input", ""))
        for y, value in zip(positions + offset, response_times):
            ax.text(value + 0.16, y, f"{value:.1f}", va="center", fontsize=8.5, color=INK)
    ax.set_yticks(positions, state_labels)
    ax.invert_yaxis()
    ax.set_xlim(0, 11.6)
    ax.set_xlabel("Time to 90% of day-12 response (d)")
    ax.set_title("B   Response-time metric", loc="left", fontsize=12.5, fontweight="bold", pad=14)
    ax.legend(frameon=False, fontsize=8.5, loc="upper right")
    ax.grid(axis="x", color=GRID, lw=0.8)
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.tick_params(axis="y", length=0)

    # C — fixed-step RK4 convergence for the reported beta-carotene endpoint.
    ax = fig.add_subplot(grid[0, 2])
    step_sizes = np.array([0.50, 0.25, 0.10, 0.05, 0.02, 0.01])
    reference = rk4(baseline, BASE, SCENARIOS["Intermediate input"], 12.0, 0.002)[1][-1, 4]
    errors = []
    for step in step_sizes:
        estimate = rk4(baseline, BASE, SCENARIOS["Intermediate input"], 12.0, float(step))[1][-1, 4]
        errors.append(abs(estimate - reference) / abs(reference) * 100.0)
    errors = np.asarray(errors)
    ax.loglog(step_sizes, errors, "o-", color=CYAN, lw=2.5, markersize=7, markeredgecolor=INK, markeredgewidth=1)
    ax.axvline(0.01, color=ORANGE, lw=1.4, ls="--")
    ax.annotate("reported step\nΔt = 0.01 d", xy=(0.01, errors[-1]), xytext=(0.018, errors[2]), arrowprops={"arrowstyle": "->", "color": ORANGE}, fontsize=9, color=INK)
    ax.set_xlabel("RK4 step size, Δt (d)")
    ax.set_ylabel("Relative error in B(12 d) (%)")
    ax.set_title("C   Step-size convergence", loc="left", fontsize=12.5, fontweight="bold", pad=14)
    ax.grid(which="both", color=GRID, lw=0.8)
    ax.spines[["top", "right"]].set_visible(False)
    ax.text(0.03, 0.95, f"Even Δt = 0.5 d: {errors.max():.2e}% error", transform=ax.transAxes, va="top", color=MUTED, fontsize=9)

    fig.subplots_adjust(left=0.055, right=0.985, bottom=0.16, top=0.83)
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
    times, traces, baseline = build_scenarios()
    figure_diagnostics(times, traces, baseline)
    figure_transfer()
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
