import { MySystem } from "../system";
import { db, SELECT_GUARD } from "../database";

function showBlock(
  self: IStoneServerSystem<MySystem> & MySystem,
  player: IEntity
) {
  self
    .openModalForm(
      player,
      JSON.stringify({
        type: "modal",
        title: "Guard System",
        content: "Blocked",
        button1: "OK",
        button2: "Sorry"
      })
    )
    .catch(() => {});
}

function simple_detect(
  self: IStoneServerSystem<MySystem> & MySystem,
  player: IEntity
): boolean {
  const info = self.actorInfo(player);
  if (info.permission > 0) return false;
  const ret = db.query(SELECT_GUARD, {
    $x: info.pos[0],
    $z: info.pos[2]
  });
  const filtered = Array.from(ret).filter(({ owner }) => owner != info.uuid);
  return !!filtered.length;
}

function target_detect(
  self: IStoneServerSystem<MySystem> & MySystem,
  player: IEntity,
  target: IEntity
): boolean {
  const info = self.actorInfo(player);
  const target_info = self.actorInfo(target);
  if (info.permission > 0) return false;
  const ret = db.query(SELECT_GUARD, {
    $x: target_info.pos[0],
    $z: target_info.pos[2]
  });
  const filtered = Array.from(ret).filter(({ owner }) => owner != info.uuid);
  return !!filtered.length;
}

function pos_detect(
  self: IStoneServerSystem<MySystem> & MySystem,
  player: IEntity,
  [$x, y, $z]: [number, number, number]
) {
  const info = self.actorInfo(player);
  if (info.permission > 0) return false;
  const ret = db.query(SELECT_GUARD, { $x, $z });
  const filtered = Array.from(ret).filter(({ owner }) => owner != info.uuid);
  return !!filtered.length;
}

export function register(self: IStoneServerSystem<MySystem> & MySystem) {
  self.checkAttack((player, target) => {
    if (target_detect(self, player, target)) {
      showBlock(self, player);
      return false;
    }
  });
  self.checkInteract((player, _, pos) => {
    if (pos_detect(self, player, pos)) {
      showBlock(self, player);
      return false;
    }
  });
  self.checkUseOn((player, _1, _2, vec) => {
    if (pos_detect(self, player, vec)) {
      showBlock(self, player);
      return false;
    }
  });
  self.checkDestroy((player, pos) => {
    if (pos_detect(self, player, pos)) {
      showBlock(self, player);
      return false;
    }
  });
  self.checkUseBlock((player, _, pos) => {
    if (pos_detect(self, player, pos)) {
      showBlock(self, player);
      return false;
    }
  });
}
