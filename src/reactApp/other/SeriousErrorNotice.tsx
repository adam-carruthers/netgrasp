import React from "react";

const SeriousErrorNotice = () => {
  return (
    <div className="py-4 px-2">
      <h1>Serious Error</h1>
      <p>
        There was a serious error and the website has crashed.{" "}
        <a
          href="https://github.com/goodyguts/netgrasp/issues/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Please report this error here.
        </a>{" "}
        We recommend that you:
      </p>
      <ol>
        <li>Refresh the page and see if the problem resolves itself.</li>
        <li>
          If it does not then{" "}
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => localStorage.clear()}
          >
            Delete local storage
          </button>{" "}
          - this will delete anything you haven&apos;t got saved to a file.
          After deleting, refresh the page again.
        </li>
        <li>
          If that did not work then please{" "}
          <a
            href="https://github.com/goodyguts/netgrasp/issues/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            report this error here.
          </a>
        </li>
      </ol>
    </div>
  );
};

export default SeriousErrorNotice;
