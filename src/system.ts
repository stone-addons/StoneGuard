import { db, SELECT_GUARD_NAMES } from "./database";

export type MySystem = SystemType<PrivSystem>;

interface PrivSystem extends IStoneServerSystem<PrivSystem> {
  registerRegionNames(this: MySystem): void;
  updateRegionNames(this: MySystem): void;
}

export const system = server.registerSystem<PrivSystem>(0, 0);

checkApiLevel(1);

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
