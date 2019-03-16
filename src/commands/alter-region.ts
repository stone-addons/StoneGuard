import { MySystem } from "../system";
import {
  db,
  SELECT_ALL_GUARD,
  RegionInfo,
  DELETE_GUARD_BY_NAME,
  UPDATE_GUARD_BY_NAME
} from "../database";

export function register(self: MySystem) {
  self.registerCommand("alter-region", {
    description: "Open Region Editor UI",
    permission: 1,
    overloads: [
      {
        parameters: [],
        handler(origin) {
          const entity = origin.entity;
          if (!entity) throw "Designed for player usage";
          const datas = Array.from(
            db.query(SELECT_ALL_GUARD, {})
          ) as RegionInfo[];
          const names = datas.map(({ name }) => name);
          (async () => {
            let result = await this.openModalForm(
              entity,
              JSON.stringify({
                type: "form",
                title: "Region Editor",
                content: "",
                buttons: names.map(text => ({ text }))
              })
            );
            let num = JSON.parse(result);
            if (typeof num == "object") return;
            if (typeof num != "number") throw new Error("Invalid type");
            result = await this.openModalForm(
              entity,
              JSON.stringify({
                type: "form",
                title: "Region Editor: " + names[num],
                content: `dim: ${datas[num].dim}\n(${datas[num].minX}, ${
                  datas[num].minZ
                }) to (${datas[num].maxX}, ${datas[num].maxZ})\n${
                  datas[num].desc
                }`,
                buttons: ["Edit", "Delete"].map(text => ({ text }))
              })
            );
            const sel = JSON.parse(result);
            if (typeof sel == "object") return;
            if (typeof sel != "number") throw new Error("Invalid type");
            server.log(sel + "");
            switch (sel) {
              case 0: // Edit
                result = await this.openModalForm(
                  entity,
                  JSON.stringify({
                    type: "custom_form",
                    title: "Edit region: " + names[num],
                    content: [
                      {
                        type: "input",
                        text: "name",
                        default: names[num]
                      },
                      {
                        type: "input",
                        text: "desc",
                        default: datas[num].desc
                      },
                      {
                        type: "input",
                        text: "dim",
                        default: datas[num].dim + ""
                      },
                      {
                        type: "input",
                        text: "x1",
                        default: datas[num].minX + ""
                      },
                      {
                        type: "input",
                        text: "z1",
                        default: datas[num].minZ + ""
                      },
                      {
                        type: "input",
                        text: "x2",
                        default: datas[num].maxX + ""
                      },
                      {
                        type: "input",
                        text: "z2",
                        default: datas[num].maxZ + ""
                      }
                    ]
                  })
                );
                server.log(result.trim());
                const obj = JSON.parse(result);
                if (obj == null) return;
                if (typeof obj != "object") throw new Error("Invalid type");
                const [$newname, $desc, ...arr] = obj as string[];
                const [$dim, $x1, $z1, $x2, $z2] = arr.map(x => +x);
                try {
                  db.update(UPDATE_GUARD_BY_NAME, {
                    $newname,
                    $name: names[num],
                    $desc,
                    $dim,
                    $x1,
                    $z1,
                    $x2,
                    $z2
                  });
                } catch (e) {
                  server.log(e);
                }
                break;
              case 1: // Delete
                db.update(DELETE_GUARD_BY_NAME, { $name: names[num] });
                break;
            }
          })().catch(e => {
            server.log(e as any);
          });
        }
      } as CommandOverload<MySystem, []>
    ]
  });
}
