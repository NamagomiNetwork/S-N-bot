const logger = require('../modules/logger')
const config = require('../utils/get-config');
const err_embed = require('../utils/error-embed');
const OmikujiModel = require('../utils/Schema/OmikujiSchema')
const profileModel = require('../utils/Schema/ProfileSchema');
const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args) => {
    try{
        const OmikujiData = await OmikujiModel.findOne({ _id: message.author.id });
        const profileData = await profileModel.findOne({ _id: message.author.id });
        if (!OmikujiData) {
            logger.error("ユーザー名: " + message.author.username + " ユーザーID: " + message.author.id + "のおみくじプロファイルが見つかりませんでした...")
            message.channel.send(({embeds: [err_embed.main]}))
            return;
        }
        if (!profileData) {
            logger.error("ユーザー名: " + message.author.username + " ユーザーID: " + message.author.id + "のプロファイルが見つかりませんでした...")
            message.channel.send(({embeds: [err_embed.main]}))
            return;
        }
        if(OmikujiData.one_day_omikuji_feature.includes("true")){
            if(OmikujiData.one_day_omikuji.includes("true")){
                let sudeni_1day_true = new MessageEmbed({
                    title: "おみくじ",
                    description: "すでに今日はおみくじを実行しています",
                    color: 5301186,
                    fields: [
                        {
                            name: "この機能を無効化するには",
                            value: "`" + profileData.prefix + "one-day-kuji` コマンドを実行してください"
                        },
                    ]
                })
                message.channel.send({embeds: [sudeni_1day_true]})
                return;
            }
        }

        let result;
        let unique;
        if (unique != "true"){
            const arr = ["大吉", "吉", "中吉", "小吉", "半吉", "凶", "大凶"];
            let random = Math.floor(Math.random() * arr.length);
            result = arr[random];
        
            let maeno_data = OmikujiData.mae_no_omikuji_kekka
            let success = new MessageEmbed({
                title: "おみくじ",
                description: "おみくじをしたよ～",
                color: 5301186,
                fields: [
                    {
                        name: "結果: ",
                        value: result
                    },
                    {
                        name: "前回の結果: ",
                        value: maeno_data
                    },
                ]
            })
            message.channel.send({embeds: [success]})
        }
        if(OmikujiData.one_day_omikuji_feature.includes("true")){
            await OmikujiData.updateOne({
                one_day_omikuji: true,
            })
        }
        await OmikujiData.updateOne({
            mae_no_omikuji_kekka: result,
        })
        } catch (err) {
            logger.error("コマンド実行エラーが発生しました")
            logger.error(err)
            message.channel.send(({embeds: [err_embed.main]}))
            if(config.debug.enable.includes("true")){
                message.channel.send(({embeds: [err_embed.debug]}))
                message.channel.send("エラー内容: ")
                message.channel.send("```\n"+ err + "\n```")
            }
        }
}

exports.name = "omikuji";
