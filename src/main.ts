import {
  SELECT_GUARD,
  db
} from "./database";

import { system, MySystem } from "./system";

declare function resolve(name: string): { register(input: IStoneServerSystem<MySystem> & MySystem): void }

system.initialize = function() {
  this.registerRegionNames();
  resolve("commands/query-region").register(this);
  resolve("commands/create-region").register(this);
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
