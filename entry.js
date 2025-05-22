let floppyfly = {
    name: "floppyfly",
    displayName: "FloppyFly",

    onTick: () => {
        let player = yarn.playerEntity;
        if (player == null) return;
        let config = modkeep.get("floppyfly", {}, (obj) => {
            obj.boost ??= 0.1;
            obj.boost2 ??= -0.1;
            obj.maxSpeed ??= 37;
            obj.boostPitch ??= -4;
            return obj;
        });

        let radianYaw = maths.toRadians(player.yaw);
        let speed = yarnutils.playerVelocity().horizontalLength();

        if (yarn.playerLiving.isFallFlying()) {
            if (speed > config.maxSpeed) {
                player.addVelocity(
                    Math.sin(radianYaw) * -config.boost2,
                    0,
                    Math.cos(radianYaw) * config.boost2,
                );

                return;
            }

            if (speed < config.maxSpeed) {
                if (yarn.client.options().backKey().isPressed()) {
                    player.addVelocity(
                        Math.sin(radianYaw) * config.boost,
                        0,
                        Math.cos(radianYaw) * -config.boost,
                    );
                } else if (player.pitch > config.boostPitch) {
                    player.addVelocity(
                        Math.sin(radianYaw) * -config.boost,
                        0,
                        Math.cos(radianYaw) * config.boost,
                    );
                }
            }
        }
    },

    onActivate: () => {
        modtoggle.registerListener(
            ClientTickEvents.START_WORLD_TICK,
            floppyfly.onTick,
            "floppyfly-onTick",
            yarnwrap.Core,
        );
    },

    onDeactivate: () => {
        modtoggle.deregisterListener(
            ClientTickEvents.START_WORLD_TICK,
            "floppyfly-onTick",
        );
    },
};

modtoggle.registerToggle(floppyfly);
