/// <reference types="stoneserver-scripting-types" />

namespace Server {
  const system = server.registerSystem<IStoneServerSystem<{}>>(0, 0);
  system.initialize = function() {
    this.log("Mod Loaded");
  };
}
