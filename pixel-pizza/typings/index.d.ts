import { IncomingMessage } from "http";

declare module 'pixel-pizza' {
    import {Client, ClientOptions, Collection, ColorResolvable, Guild, GuildMember, Message, MessageEmbed, MessageReaction, MessageResolvable, RoleResolvable, Snowflake, TextChannel, User} from "discord.js";
    import {Canvas} from "canvas";

    /**
     * A dictionary with hex, rgb, hsl and cmyk values
     */
    type ColorData = {
        hex: string,
        rgb: [number, number, number],
        hsl: [number, number, number],
        cmyk: [number, number, number, number]
    }

    /**
     * A dictonary with an id and token
     */
    type WebhookData = {
        id: Snowflake,
        token: string
    }

    /**
     * A dictionary with a name, aliases and questions
     */
    type ApplicationType = {
        name: string,
        aliases: string[],
        questions: string[]
    }

    /**
     * A dictionary with options for a discord embed message
     */
    type EmbedOptions = {
        color?: ColorResolvable,
        title?: string,
        url?: string,
        author?: {
            name: string,
            icon?: string,
            url?: string
        },
        description?: string,
        thumbnail?: string,
        fields?: {
            name: string,
            value: string,
            inline?: boolean
        }[],
        image?: string,
        timestamp?: boolean,
        footer?: {
            text: string,
            icon?: string
        }
    }

    /**
     * A function that sends logs to the console and guild
     */
    type ConsoleFunction = (text: string, title?: string) => void

    /**
     * A dictonary with color values in hex, rgb, hsl and cmyk format
     */
    export const colors: {
        black: ColorData,
        white: ColorData,
        red: ColorData,
        green: ColorData,
        blue: ColorData,
        yellow: ColorData,
        lightblue: ColorData,
        purple: ColorData,
        orange: ColorData,
        silver: ColorData,
        darkgray: ColorData,
        darkgrey: ColorData,
        gray: ColorData,
        grey: ColorData,
        lightgray: ColorData,
        lightgrey: ColorData,
        noiceboard: ColorData,
        levels: {
            front: ColorData,
            back: ColorData,
            expfront: ColorData,
            expback: ColorData
        }
    }

    /**
     * A dictonary of discord voice and text channel ids
     */
    export const channels: {
        voice: {
            allMembers: Snowflake,
            members: Snowflake,
            bots: Snowflake
        },
        text: {
            logs: Snowflake,
            noiceboard: Snowflake,
            updates: Snowflake,
            kitchen: Snowflake,
            images: Snowflake,
            delivery: Snowflake,
            restaurant: Snowflake,
            applications: Snowflake,
            suggestions: Snowflake,
            complaints: Snowflake
        }
    }

    /**
     * A dictionary with delivery message variables
     */
    export const variables: {
        required: string[],
        others: string[]
    }

    /**
     * A dictionary with webhook ids and tokens
     */
    export const webhooks: {
        log: WebhookData
    }

    /**
     * A dictonary with discord role ids
     */
    export const emojis: {
        noice: Snowflake,
        noice2: Snowflake
    }

    /**
     * An array with ingredients
     */
    export const ingredients: string[]

    /**
     * A dicotnary with level configurations
     */
    export const level: {
        baseexp: number,
        addexp: number
    }

    /**
     * An array with pizzas on the menu
     */
    export const menu: string[]

    /**
     * A dictionary with application types
     */
    export const questions: {
        worker: ApplicationType,
        teacher: ApplicationType,
        developer: ApplicationType,
        staff: ApplicationType
    }

    /**
     * A dictonary with discord role ids
     */
    export const roles: {
        developer: Snowflake,
        cook: Snowflake,
        deliverer: Snowflake,
        proCook: Snowflake,
        proDeliverer: Snowflake,
        work: Snowflake,
        ceo: Snowflake,
        verified: Snowflake,
        worker: Snowflake[],
        teacher: Snowflake[],
        staff: Snowflake[],
        director: Snowflake[],
        levelRoles: {
            five: Snowflake,
            ten: Snowflake,
            twentyfive: Snowflake,
            fifty: Snowflake,
            hundered: Snowflake
        },
        pings: {
            cook: Snowflake,
            deliver: Snowflake
        }
    }

    /**
     * A dictionary of the rules and anarchy rules of the bot
     */
    export const rules: {
        rules: string[],
        anarchyRules: string[]
    };

    /**
     * A dictonary with bot configurations
     */
    export const config: {
        prefix: string,
        currency: string,
        verification: Snowflake,
        workerRoles: Snowflake,
        botGuild: Snowflake,
        noiceboardMinValue: number,
        maxPizzas: number,
        proAmount: number,
        idLength: number,
        orderCooldown: number,
        minPrice: number,
        maxPrice: number,
        minWorkEarning: number,
        maxWorkEarning: number,
        workCauses: string[],
        statuses: {
            orders: string[],
            applications: string[]
        },
        restrictedDomains: string[],
        pponlyexceptions: Snowflake[],
        invite: string,
        creators: Snowflake[]
    }
    
    /**
     * the Pixel Pizza extended version of the discord.js Client class
     * @extends {Client}
     */
    export class PPClient extends Client {
        /**
         * @param {ClientOptions} options Options for the client
         */
        constructor(options: ClientOptions)
        /**
         * The commands of the bot
         */
        public commands: Collection<string, any>
        /**
         * The cooldowns on users of the bot
         */
        public cooldowns: Collection<string, Collection<string, number>>
        /**
         * The members of the main guild of the bot
         */
        public guildMembers: Collection<string, GuildMember>
        /**
         * Boolean configurations of the bot
         */
        public toggles: {
            cooldowns: boolean,
            addExp: boolean,
            pponlyChecks: boolean,
            workerApplications: boolean,
            teacherApplications: boolean,
            developerApplications: boolean,
            staffApplications: boolean,
            cookOwnOrder: boolean,
            deliverOwnOrder: boolean
        }
        /**
         * If the client can send embeds to the channel
         */
        public canSendEmbeds: boolean
    }

    /**
     * Add a role to a discord member
     * @param {GuildMember} member The discord member to add the role to
     * @param {RoleResolvable} role The discord role to add to the member
     * @returns {Promise<GuildMember>} A promise with the member that the role was added to
     */
    export const addRole: (member: GuildMember, role: RoleResolvable) => Promise<GuildMember>

    /**
     * Captialize a string
     * @param {string} string The string to capitalize
     * @returns {string} The capitalized string
     */
    export const capitalize: (string: string) => string

    /**
     * check if a message from a messageReaction is good enough for the noice board
     * @param {MessageReaction} messageReaction The messageReaction to check the message of
     * @returns {void | Promise<Message>} Returns a promise with the noiceboard message if it was added to the noiceboard
     */
    export const checkNoiceBoard: (messageReaction: MessageReaction) => any

    /**
     * Create a new embed with options
     * @param {{
     *  color:string,
     *  title:string,
     *  url:string,
     *  author:{
     *      name:string,
     *      icon:string,
     *      url:string
     *  },
     *  description:string,
     *  thumbnail:string,
     *  fields:{
     *      name:string,
     *      value:string,
     *      inline:boolean
     *  }[],
     *  image:string,
     *  timestamp:boolean,
     *  footer:{
     *      text:string,
     *      icon:string
     *  }
     * }} options The options for the embed message
     * @returns {MessageEmbed} The made embed message
     */
    export const createEmbed: (options: EmbedOptions) => MessageEmbed

    /**
     * Edit an embed message
     * @param {MessageEmbed} embedMsg 
     * @param {{
     *  color:string,
     *  title:string,
     *  url:string,
     *  author:{
     *      name:string,
     *      icon:string,
     *      url:string
     *  },
     *  description:string,
     *  thumbnail:string,
     *  fields:{
     *      name:string,
     *      value:string,
     *      inline:boolean
     *  }[],
     *  image:string,
     *  timestamp:boolean,
     *  footer:{
     *      text:string,
     *      icon:string
     *  }
     * }} options The options for the embed message
     * @returns {MessageEmbed} The edited embed message
     */
    export const editEmbed: (embedMsg: MessageEmbed, options: EmbedOptions) => MessageEmbed

    /**
     * Get a guild by arguments
     * @param {string[]} args The arguments used as guild name
     * @param {PPClient} client The client to get the guild from
     * @returns {Guild} Returns the found guild if there is one
     */
    export const getGuild: (args: string[], client: PPClient) => Guild

    /**
     * Get a user by message mentions and arguments
     * @param {Message} message The message to get mentions from
     * @param {string[]} args The arugments used as username or user id
     * @param {PPClient} client The client to get the user from
     */
    export const getUser: (message: Message, args: string[], client: PPClient) => User

    /**
     * A sorter version of checking if a member has a role
     * @param {GuildMember} member The member to check
     * @param {RoleResolvable} role The role to check
     * @returns {boolean} True if the user has the role, otherwise false
     */
    export const hasRole: (member: GuildMember, role: RoleResolvable) => boolean

    /**
     * Check if a user is in the main guild of the bot
     * @param {PPClient} client The client to check the members from
     * @param {Snowflake} userId The id of the user to check
     * @returns {boolean} if the user is in the main guild of the bot 
     */
    export const inBotGuild: (client: PPClient, userId: Snowflake) => boolean

    /**
     * Check if a url points to an image
     * @param {string} url the url to use as image
     * @returns {boolean} If the url is an image
     */
    export const isImage: (url: string) => boolean

    /**
     * Check if a member has the vip role
     * @param {GuildMember} member The member to check from
     * @returns {boolean} If the user has the vip role
     */
    export const isVip: (member: GuildMember) => boolean

    /**
     * Makes a new stirng by joining array values with seperators
     * @param {any[]} array
     * @param {string} seperator The seperator for the array
     * @param {string} endSeperator The last seperator for the array
     * @returns {string} The string with seperators
     */
    export const join: (array: any[], seperator: string, endSeperator: string) => string

    /**
     * Remove a role from a discord member
     * @param {GuildMember} member The discord member to remove the role from
     * @param {RoleResolvable} role The discord role to remove from the member
     * @returns {Promise<GuildMember>} A promise with the member that the role was removed from
     */
    export const removeRole: (member: GuildMember, role: RoleResolvable) => Promise<GuildMember>

    /**
     * Send a request to the specified url
     * @param {string} url The url to make a request to
     * @param {"GET" | "POST" | "PUT" | "DELETE" | "PATCH"} method The method to use
     * @returns {Promise<IncomingMessage>} The data the request returns
     */
    export const request: (url: string, method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH") => Promise<IncomingMessage>

    /**
     * send an embed to a channel from a message
     * @param {MessageEmbed} embed The embed to send
     * @param {PPClient} client The client to use to check if an embed can be sent
     * @param {Message} message The message to get the channel from
     * @returns {void}
     */
    export function sendEmbed(embed: MessageEmbed, client: PPClient, message: Message): Promise<Message>
    /**
     * send an embed to a channel
     * @param {MessageEmbed} embed The embed to send
     * @param {PPClient} client The client to use to check if an embed can be sent
     * @param {Channel} message The channel to send the message to
     * @returns {void}
     */
    export function sendEmbed(embed: MessageEmbed, client: PPClient, channel: TextChannel): Promise<Message>

    /**
     * send a webhook message in the guild logs channel
     * @param {string} name the name of the webhook
     * @param {string} avatar the avatar url of the webhook
     * @param {MessageResolvable} message the message to send with the webhook
     * @returns {Promise<void>}
     */
    export const sendGuildLog: (name: string, avatar: string, message: MessageResolvable | MessageEmbed) => Promise<void>

    /**
     * Set a cooldown for a command for a user
     * @param {PPClient} client The client to get the cooldowns from
     * @param {string} commandName The name of the command
     * @param {Snowflake} userId The id of the user
     * @param {number} seconds The amount of seconds the cooldown lasts
     * @returns {void}
     */
    export const setCooldown: (client: PPClient, commandName: string, userId: Snowflake, seconds: number) => void

    /**
     * Changes a timestamp into a date string in dd-mm-YYYY format
     * @param {number} timestamp The amount of seconds from 1970-01-01 00:00:00
     * @returns {string} The date as a string (dd-mm-YYYY)
     */
    export const timestampToDate: (timestamp: number) => string

    /**
     * Update the amount of guilds in Pixel Pizza
     * @param {PPClient} client The client to get the members and channels from
     * @returns {void}
     */
    export const updateGuildAmount: (client: PPClient) => void

    /**
     * Update the amount of members in Pixel Pizza
     * @param {PPClient} client The client to get the members and channels from
     * @returns {void}
     */
    export const updateMemberSize: (client: PPClient) => void

    /**
     * Set a timeout
     * @param {number} ms The miliseconds the timeout lasts
     * @returns {Promise<[]>} A promise with an empty array
     */
    export const wait: (ms: number) => Promise<[]>
    
    /**
     * Makes a rank image
     * @param {User} user The user to use the avatar from
     * @param {number} level The level of the user
     * @param {number} exp The exp of the user
     * @param {number | string} rank The rank of the user
     * @param {{
     *  back:string,
     *  front:string,
     *  expBack:string,
     *  expFront:string
     * }} style The image style of the user
     * @returns {Canvas} The canvas used to make the image
     */
    export const makeRankImg: (user: User, level: number, exp: number, rank: number, style: {
        back: string,
        front: string,
        expBack: string,
        expFront: string
    }) => Promise<Canvas>

    /**
     * Clear the console and send a notice that it has been cleared
     * @returns {void}
     */
    export const clear: () => void

    /**
     * Counts a label (shorter version of console.count)
     * @param {string} label The label to use
     * @returns {void}
     */
    export const count: (label: string) => void

    /**
     * Sends a error log to the console and the main server of the bot
     * @param {string} text The text to log as error
     * @param {string} title The title to color red
     * @returns {void}
     */
    export const error: ConsoleFunction

    /**
     * Sends a fatal error log to the console and the main server of the bot
     * @param {string} text The text to log as fatal error
     * @param {string} title The title to color bright red
     * @returns {void}
     */
    export const fatal: ConsoleFunction

    /**
     * Sends an info log to the console and the main server of the bot
     * @param {string} text The text to log as info
     * @param {string} title The title to color bright blue
     * @returns {void}
     */
    export const info: ConsoleFunction

    /**
     * Sends a log to the console and the main server of the bot
     * @param {string} text The text to log
     * @param {string} title The title to color blue
     * @returns {void}
     */
    export const log: ConsoleFunction

    /**
     * Sends a notice log to the console and the main server of the bot
     * @param {string} text The text to log as notice
     * @param {string} title The title to color gray
     * @returns {void}
     */
    export const notice: ConsoleFunction

    /**
     * Resets the count on a label (shorter version of console.countReset)
     * @param {string} label The label to use
     * @returns {void}
     */
    export const resetCount: (label: string) => void 

    /**
     * Send a log to the console of the main server
     * @param {string} text The text to log
     * @param {string} title The title of the log
     * @returns {Promise<void>}
     */
    export const sendServerLog: (text: string, title?: string) => Promise<void>

    /**
     * Sends an success log to the console and the main server of the bot
     * @param {string} text The text to log as success
     * @param {string} title The title to color green
     * @returns {void}
     */
    export const success: ConsoleFunction

    /**
     * Sends a watning log to the console and the main server of the bot
     * @param {string} text The text to log as warning
     * @param {string} title The title to color yellow
     * @returns {void}
     */
    export const warn: ConsoleFunction
}