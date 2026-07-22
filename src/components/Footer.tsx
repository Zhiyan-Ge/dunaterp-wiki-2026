import { stringToSlug } from "../utils";
import { Link } from "react-router-dom";

export function Footer() {
  const teamYear = import.meta.env.VITE_TEAM_YEAR;
  const teamName = import.meta.env.VITE_TEAM_NAME;
  const teamSlug = stringToSlug(teamName);

  return (
    <footer className="pt-5 pb-5 footer py-5 mt-5 bg-dark text-white">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6 col-xs-12">
            <h4 className="mb-3">Small leaf. Big protection.</h4>
            <p>
              SCU-China is engineering duckweed as a plant-based vaccine
              platform for livestock and poultry mucosal protection.
            </p>
          </div>
          <div className="col-lg-3 col-xs-12">
            <h4 className="mt-lg-0 mt-sm-3">Explore</h4>
            <ul className="m-2 p-2">
              <li>
                <Link to="/description">Project description</Link>
              </li>
              <li>
                <Link to="/engineering">Engineering</Link>
              </li>
              <li>
                <Link to="/experiments">Experiments</Link>
              </li>
              <li>
                <Link to="/human-practices">Human practices</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-xs-12">
            <h4 className="mt-lg-0 mt-sm-4 mb-3">Team</h4>
            <p>Sichuan University</p>
            <p>SCU-China · iGEM {teamYear}</p>
          </div>
        </div>
        <hr />
        {/* The following MUST be on every page: license information and link to the repository on gitlab.igem.org */}
        <div className="row mt-4">
          <div className="col">
            <p className="mb-0">
              <small>
                © {teamYear} - Content on this site is licensed under a{" "}
                <a
                  className="subfoot"
                  href="https://creativecommons.org/licenses/by/4.0/"
                  rel="license"
                >
                  Creative Commons Attribution 4.0 International license
                </a>
                .
              </small>
            </p>
            <p>
              <small>
                The repository used to create this website is available at{" "}
                <a href={`https://gitlab.igem.org/${teamYear}/${teamSlug}`}>
                  gitlab.igem.org/{teamYear}/{teamSlug}
                </a>
                .
              </small>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
