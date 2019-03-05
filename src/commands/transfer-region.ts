import { MySystem } from "../system";
import { db, CHOWN_GUARD } from "../database";

export function register(self: IStoneServerSystem<MySystem> & MySystem) {
  self.registerCommand("transfer-region", {
    description: "Transfer the ownership of Region",
    permission: 1,
    overloads: [
      {
        parameters: [
          {
            name: "name",
            type: "soft-enum",
            enum: "RegionName"
          },
          {
            name: "target",
            type: "player-selector"
          }
        ],
        handler($name, target) {
          if (target.length != 1) throw "check the selector!"
          const $owner = this.actorInfo(target[0]).uuid;
          db.update(CHOWN_GUARD, { $name, $owner });
          return `transfered`;
        }
      }
    ]
  });
}