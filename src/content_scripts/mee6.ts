const token = localStorage.getItem("token")?.replace(`"`, "").replace(`"`, "");

if (token) {
  console.log(`MEE6 token is ${token}`);

  chrome.storage.local.set({
    mee6_account_token: token,
  });

  chrome.runtime.sendMessage({
    op: `mee6_account_token`,
    d: token,
  });
}
