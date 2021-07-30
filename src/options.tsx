import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Options = () => {
  const [mee6Token, setMEE6Token] = useState<string>();
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    chrome.storage.local.get([`mee6_account_token`], (items) => {
      setMEE6Token(items["mee6_account_token"]);
    });
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.local.set(
      {
        mee6_account_token: mee6Token,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");

        const id = setTimeout(() => {
          setStatus(undefined);
        }, 1000);

        return () => clearTimeout(id);
      }
    );
  };

  return (
    <>
      <div></div>
      <div>
        <form>
          <label>MEE6 Account Token:</label>
          <br />

          <textarea
            style={{
              width: `350px`,
              height: `150px`,
            }}
            onChange={(event) => setMEE6Token(event.target.value)}
            value={mee6Token}
          ></textarea>
        </form>
      </div>
      <div>{status}</div>

      <br />
      <i
        id="warning"
        style={{
          color: `gray`,
        }}
      >
        Do not change the options if you do not understand what they mean.
        Changing the options might break the extension.
      </i>

      <br />
      <br />

      <button onClick={saveOptions}>Save</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
