/// <reference types="stoneserver-scripting-types" />
import {
  CREATE_TABLE,
  INSERT_GUARD,
  SELECT_GUARD,
  SELECT_GUARD_NAMES
} from "./database";

interface MySystem extends IStoneServerSystem<MySystem> {
  registerRegionNames(this: MySystem): void;
  updateRegionNames(this: MySystem): void;
}

const system = server.registerSystem<MySystem>(0, 0);

const db = new SQLite3("guard.db");
db.exec(CREATE_TABLE);

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

system.initialize = function() {
  this.registerRegionNames();
  this.registerCommand("create-region", {
    description: "Create Region",
    permission: 1,
    overloads: [
      {
        parameters: [
          {
            name: "start",
            type: "position"
          },
          {
            name: "end",
            type: "position"
          },
          {
            name: "name",
            type: "string"
          }
        ],
        handler(start, end, name) {
          const entity = this.currentCommandOrigin().entity;
          if (!entity) throw "Designed for player usage";
          const info = this.actorInfo(entity);
          if (!info.uuid) throw "Designed for player usage";
          const [x0, , z0] = start;
          const [x1, , z1] = end;
          const $x0 = Math.min(x0, x1);
          const $x1 = Math.max(x0, x1);
          const $z0 = Math.min(z0, z1);
          const $z1 = Math.max(z0, z1);
          db.update(INSERT_GUARD, {
            $name: name,
            $owner: info.uuid,
            $x0,
            $z0,
            $x1,
            $z1
          });
          this.updateRegionNames();
          return `created ${name}`;
        }
      }
    ]
  });

  this.checkAbility(player => {
    const info = this.actorInfo(player);
    if (info.permission > 0) return true;
    const ret = db.query(SELECT_GUARD, {
      $x: info.pos[0],
      $z: info.pos[2]
    });
    const filtered = Array.from(ret).filter(({ owner }) => owner != info.uuid);
    if (filtered.length) {
      this.openModalForm(
        player,
        JSON.stringify({
          type: "modal",
          title: "Guard System",
          content: "Blocked",
          button1: "OK",
          button2: "Sorry"
        })
      ).catch(() => {});
      return false;
    }
  });
};
