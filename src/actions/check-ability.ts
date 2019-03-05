import { MySystem } from "../system";
import { db, SELECT_GUARD } from "../database";

export function register(self: IStoneServerSystem<MySystem> & MySystem) {
  self.checkAbility(player => {
    const info = self.actorInfo(player);
    if (info.permission > 0) return true;
    const ret = db.query(SELECT_GUARD, {
      $x: info.pos[0],
      $z: info.pos[2]
    });
    const filtered = Array.from(ret).filter(({ owner }) => owner != info.uuid);
    if (filtered.length) {
      self.openModalForm(
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
}