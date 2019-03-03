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
    +name TEXT NOT NULL UNIQUE,
    +owner TEXT NOT NULL
  );`;

export const INSERT_GUARD = fix`
  INSERT INTO guard (
    name,
    owner,
    minX,
    minZ,
    maxX,
    maxZ
  ) values (
    $name,
    $owner,
    $x0,
    $z0,
    $x1,
    $z1
  );`;

export const SELECT_GUARD = fix`
  SELECT
    name,
    owner
  FROM guard
  WHERE minX <= $x
    AND maxX >= $x
    AND minZ <= $z
    AND maxZ >= $z;`;

export const SELECT_GUARD_NAMES = fix`SELECT name FROM guard;`;
