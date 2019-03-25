import { MySystem } from "../system";
import { db, INSERT_GUARD } from "../database";
import { isPlayerInfo } from "../utils";

export function register(self: MySystem) {
  self.registerCommand("create-region", {
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
          },
          {
            name: "desc",
            type: "string"
          }
        ],
        handler(origin, [start, end, $name, $desc]) {
          const entity = origin.entity;
          if (!entity) throw "Designed for player usage";
          const info = this.actorInfo(entity);
          if (!isPlayerInfo(info) || !info.uuid) throw "Designed for player usage";
          const [x0, , z0] = start;
          const [x1, , z1] = end;
          const $dim = info.dim;
          const $owner = info.uuid;
          const $x0 = Math.min(x0, x1);
          const $x1 = Math.max(x0, x1);
          const $z0 = Math.min(z0, z1);
          const $z1 = Math.max(z0, z1);
          db.update(INSERT_GUARD, {
            $name,
            $desc,
            $owner,
            $dim,
            $x0,
            $z0,
            $x1,
            $z1
          });
          this.updateRegionNames();
          return `created ${$name}`;
        }
      } as CommandOverload<
        MySystem,
        ["position", "position", "string", "string"]
      >
    ]
  });
}
