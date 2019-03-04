import { MySystem } from "../system";
import { db, INSERT_GUARD } from "../database";

export function register(self: IStoneServerSystem<MySystem> & MySystem) {
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
}