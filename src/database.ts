function fix(arr: TemplateStringsArray) {
  return arr
    .join("")
    .replace(/\(\n\s+/g, "(")
    .replace(/\n\s+\)/g, ")")
    .replace(/\s+/g, " ");
}

export const CREATE_TABLE = fix`
  CREATE VIRTUAL TABLE IF NOT EXISTS guard USING rtree_i32(
    id,
    minX,
    maxX,
    minZ,
    maxZ,
    +dim INTEGER,
    +name TEXT NOT NULL UNIQUE,
    +owner TEXT NOT NULL,
    +desc TEXT NOT NULL
  );`;

export const INSERT_GUARD = fix`
  INSERT INTO guard (
    name, owner, desc, dim, minX, minZ, maxX, maxZ
  ) values (
    $name, $owner, $desc, $dim, $x0, $z0, $x1, $z1
  );`;

export const CHOWN_GUARD = fix`UPDATE guard SET owner=$owner WHERE name=$name;`;

export const SELECT_GUARD = fix`
  SELECT
    name, desc, owner
  FROM guard
  WHERE minX <= $x
    AND maxX >= $x
    AND minZ <= $z
    AND maxZ >= $z
    AND dim = $dim;`;

export const SELECT_GUARD_NAMES = fix`SELECT name FROM guard;`;
export const SELECT_ALL_GUARD = fix`SELECT * FROM guard;`;
export const SELECT_GUARD_BY_NAME = fix`SELECT * FROM guard WHERE name=$name;`;
export const UPDATE_GUARD_BY_NAME = fix`
  UPDATE guard
  SET
    name=$newname,
    desc=$desc,
    dim=$dim,
    minX=min($x1, $x2),
    minZ=min($z1, $z2),
    maxX=max($x1, $x2),
    maxZ=max($z1, $z2)
  WHERE name=$name;`;
export const DELETE_GUARD_BY_NAME = fix`DELETE FROM guard WHERE name=$name;`;

export const db = new SQLite3("guard.db");
db.exec(CREATE_TABLE);

export type RegionInfo = {
  name: string;
  owner: string;
  desc: string;
  dim: number;
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
};
