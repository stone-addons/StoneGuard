import { MySystem } from "../system";
import {
  db,
  SELECT_ALL_GUARD,
  SELECT_GUARD_BY_NAME,
  RegionInfo
} from "../database";

const showRegion = ({ name, owner, desc, dim, minX, minZ, maxX, maxZ }: RegionInfo) =>
  `§c§o${name}§r@§1${dim}§r Owned by §a§l§n${owner}§r\nfrom (§9${minX}§r, §e${minZ}§r) to (§9${maxX}§r, §e${maxZ}§r)\n${desc}`;

export function register(self: IStoneServerSystem<MySystem> & MySystem) {
  self.registerCommand("query-region", {
    description: "Query Region",
    permission: 0,
    overloads: [
      {
        parameters: [],
        handler() {
          return Array.from(db.query(SELECT_ALL_GUARD, {}))
            .map(showRegion)
            .join("\n--------\n");
        }
      },
      {
        parameters: [
          {
            name: "name",
            type: "soft-enum",
            enum: "RegionName"
          }
        ],
        handler($name) {
          return Array.from(db.query(SELECT_GUARD_BY_NAME, { $name }))
            .map(showRegion)
            .join("\n--------\n");
        }
      }
    ]
  });
}
