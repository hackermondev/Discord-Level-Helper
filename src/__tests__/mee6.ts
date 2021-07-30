import MEE6Api from "../core/MEE6Api";

const mee6 = new MEE6Api();

test(`should return 404 for server`, () => {
  mee6.getGuildInfo("6969", (guildDetails: any, isOkay: boolean) => {
    expect(isOkay).toBe(false);
  });
});

test(`should not return 404 for server`, () => {
  // Official MEE6 server
  mee6.getGuildInfo(
    "159962941502783488",
    (guildDetails: any, isOkay: boolean) => {
      expect(isOkay).toBe(true);
    }
  );
});

test(`should not return player information`, () => {
  // Official MEE6 server
  mee6.getGuildInfo(
    "159962941502783488",
    (guildDetails: any, isOkay: boolean) => {
      expect(isOkay).toBe(true);
      expect(guildDetails.player).toBe(null);
    }
  );
});
