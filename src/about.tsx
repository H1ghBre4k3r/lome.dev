import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./about.css";
import { Component } from "./component";
import { siNeovim, siTypescript, siReact, siDocker, siKubernetes, siRust } from "simple-icons";
import { svg } from "./utils";

@Component("website-about")
export class WebsiteAbout extends AbstractElement {
  constructor() {
    super();
  }

  render() {
    return (
      <section className="about" id="about">
        <div className="about-content">
          <h2 className="section-title">About Me</h2>
          <github-stats></github-stats>
          <div className="about-grid">
            <div className="about-text">
              <p>
                I'm a computer science student with a passion for crafting elegant code and building
                powerful developer tools. As a GitHub Campus Expert, I love sharing knowledge and
                contributing to the open-source community.
              </p>
              <p>
                My journey in tech is driven by curiosity and a constant desire to learn. Whether it's
                exploring new programming paradigms, optimizing performance, or creating intuitive user
                experiences, I'm always pushing the boundaries of what's possible.
              </p>
              <p>
                When I'm not coding, you'll find me deep in Neovim configuration files, contributing to
                open-source projects, or exploring the latest developments in cloud-native technologies.
              </p>
            </div>
            <div className="about-skills">
              <h3>Technologies I Love</h3>
              <div className="skills-grid">
                <div className="skill-item">
                  {svg(siTypescript.svg)}
                  <span>TypeScript</span>
                </div>
                <div className="skill-item">
                  {svg(siReact.svg)}
                  <span>React</span>
                </div>
                <div className="skill-item">
                  {svg(siRust.svg)}
                  <span>Rust</span>
                </div>
                <div className="skill-item">
                  {svg(siDocker.svg)}
                  <span>Docker</span>
                </div>
                <div className="skill-item">
                  {svg(siKubernetes.svg)}
                  <span>Kubernetes</span>
                </div>
                <div className="skill-item">
                  {svg(siNeovim.svg)}
                  <span>Neovim</span>
                </div>
              </div>
            </div>
            <website-achievements></website-achievements>
          </div>
        </div>
      </section>
    );
  }
}
