/** @typedef {import('./assetmanager')} */
/** @typedef {import('./gameengine')} */
/** @typedef {import('./animator')} */

class Entity {
    static #moveLimit = 768 - 36;
    static #speed = 100;

    /**
     * @param {...Animator} animations
     */
    constructor(...animations) {
        this.animations = animations
        this.x = 0
        this.y = 0
        this.state = 0
    }

    update() {}

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {GameEngine} gameEngine
     */
    draw(ctx, gameEngine) {
        switch (this.state) {
            case 0: {
                this.y += gameEngine.clockTick * Entity.#speed;
                if (this.y >= Entity.#moveLimit) {
                    this.y = Entity.#moveLimit
                    this.state = 1
                }
                break
            }
            case 1: {
                this.x += gameEngine.clockTick * Entity.#speed;
                if (this.x >= Entity.#moveLimit) {
                    this.x = Entity.#moveLimit
                    this.state = 2
                }
                break
            }
            case 2: {
                this.y -= gameEngine.clockTick * Entity.#speed;
                if (this.y <= 0) {
                    this.y = 0
                    this.state = 3
                }
                break
            }
            case 3: {
                this.x -= gameEngine.clockTick * Entity.#speed;
                if (this.x <= 0) {
                    this.x = 0
                    this.state = 0
                }
                break
            }
        }

        this.animations[this.state].drawFrame(
            gameEngine.clockTick,
            ctx,
            this.x,
            this.y,
            1,
            false,
            false
        )
    }
}

{
    const SPRITESHEET = "./spritesheet.webp"

    const gameEngine = new GameEngine()
    const ASSET_MANAGER = new AssetManager()

    ASSET_MANAGER.queueDownload(SPRITESHEET)

    ASSET_MANAGER.downloadAll(() => {
        const ROGUE_DOWN = new Animator(
            ASSET_MANAGER.getAsset(SPRITESHEET),
            14,
            14 + 36,
            36,
            36,
            3,
            0.5
        ) 
        const ROGUE_RIGHT = new Animator(
            ASSET_MANAGER.getAsset(SPRITESHEET),
            14,
            14,
            36,
            36,
            2,
            0.5
        )
        const ROGUE_UP = new Animator(
            ASSET_MANAGER.getAsset(SPRITESHEET),
            14,
            14 + 36 * 2,
            36,
            36,
            3,
            0.5
        ) 

        const canvas = document.getElementById("gameWorld")
        const ctx = canvas.getContext("2d")

        gameEngine.init(ctx)
        gameEngine.addEntity(new Entity(ROGUE_DOWN, ROGUE_RIGHT, ROGUE_UP, ROGUE_RIGHT))
        gameEngine.start()
    })
}
