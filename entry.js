let floppyfly = {
    name: "floppyfly",
    displayName: "FloppyFly",

    onTick: () => {
        if (pEntity == undefined) return;

        let config = modkeep.get("floppyfly", {}, (obj) => {
            obj.boost ??= 0.1;
            obj.boost2 ??= -0.1;
            obj.maxSpeed ??= 37;
            obj.boostPitch ??= -4;
            return obj;
        });

        let radianYaw = utils.toRadians(pEntity.yaw);
        let speed = utils.playerVelocity().horizontalLength();

        if (pLiving.isFallFlying()) {
            if (speed > config.maxSpeed) {
                pEntity.addVelocity(
                    Math.sin(radianYaw) * -config.boost2,
                    0,
                    Math.cos(radianYaw) * config.boost2,
                );

                return;
            }

            if (speed < config.maxSpeed) {
                if (mc.options().backKey().isPressed()) {
                    pEntity.addVelocity(
                        Math.sin(radianYaw) * config.boost,
                        0,
                        Math.cos(radianYaw) * -config.boost,
                    );
                } else if (pEntity.pitch > config.boostPitch) {
                    pEntity.addVelocity(
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
            ClientTickEvents.START_CLIENT_TICK,
            floppyfly.onTick,
            "floppyfly-onTick",
            yarnwrap.Core
        );
    },

    onDeactivate: () => {
        modtoggle.deregisterListener(
            ClientTickEvents.START_CLIENT_TICK,
            "floppyfly-onTick",
            yarnwrap.Core
        );
    },
};

modtoggle.registerToggle(floppyfly);
