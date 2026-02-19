import { ReactNode } from "react";

export function PageTitle(props: { title: string; subtitle?: string; action?: ReactNode }): JSX.Element {
  return (
    <section className="page-title">
      <div className="page-heading">
        <h2>{props.title}</h2>
        {props.subtitle ? <p>{props.subtitle}</p> : null}
      </div>
      {props.action ? <div className="page-action">{props.action}</div> : null}
    </section>
  );
}

export function InlineNotice(props: { type: "error" | "info"; children: ReactNode }): JSX.Element {
  return <p className={`notice ${props.type}`}>{props.children}</p>;
}

export function Loading(): JSX.Element {
  return <p className="muted">Loading...</p>;
}
