import { db, SELECT_GUARD_NAMES } from "./database";

export interface MySystem extends IStoneServerSystem<MySystem> {
  registerRegionNames(this: MySystem): void;
  updateRegionNames(this: MySystem): void;
}

export const system = server.registerSystem<MySystem>(0, 0);

system.registerRegionNames = function() {
  this.registerSoftEnum(
    "RegionName",
    Array.from(db.query(SELECT_GUARD_NAMES, {})).map(({ name }) => name)
  );
};

system.updateRegionNames = function() {
  this.updateSoftEnum(
    "RegionName",
    Array.from(db.query(SELECT_GUARD_NAMES, {})).map(({ name }) => name)
  );
};
