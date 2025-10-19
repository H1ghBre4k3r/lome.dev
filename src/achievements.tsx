import { a, AbstractElement } from "@pesca-dev/atomicity";
import { Component } from "./component";

interface Badge { key: string; title: string; desc: string; icon?: string; }

const BADGES: Badge[] = [
  { key: "pull-shark", title: "Pull Shark ×3", desc: "Merged PRs across projects" },
  { key: "arctic", title: "Arctic Code Vault", desc: "Archive Program 2020" },
  { key: "starstruck", title: "Starstruck", desc: "Project received stars" },
  { key: "pair", title: "Pair Extraordinaire", desc: "Collaborative PRs" },
  { key: "yolo", title: "YOLO", desc: "Hotfix merged quickly" },
  { key: "quickdraw", title: "Quickdraw", desc: "Fast response to issues" }
];

@Component("website-achievements")
export class WebsiteAchievements extends AbstractElement {
  connectedCallback() {
    super.connectedCallback();
  }

  badges = () => {
    return BADGES.map((badge) => {
      const { desc, title } = badge;
      return <div className={"badge"} title={desc}>
        <div className={"badge-medal"}></div>
        <div className={"badge-title"}>{title}</div>
      </div>
    })
  }

  render() {
    return (
      <section className="achievements" aria-label="GitHub achievements">
        <div className="achievements-grid">{this.badges}</div>
      </section>
    ) as HTMLElement;
  }
}
