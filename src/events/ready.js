const cron = require('node-cron')
const logger = require("../modules/logger")
const config = require("../utils/get-config");
const OmikujiModel = require('../utils/Schema/OmikujiSchema')
module.exports = (client) => {
      client.user.setActivity( config.bot.prefix + 'help' , {type: 'PLAYING'});

    // ステータス
    cron.schedule('0 0 1 * * *', () => {
      client.user.setActivity( config.bot.prefix + 'help' + ' | すやすや', {type: 'PLAYING'});
    })
    cron.schedule('0 0 12 * * *', () => {
      client.user.setActivity( config.bot.prefix + 'help' + ' | ごはんもぐもぐ', {type: 'PLAYING'});
    })

    async function one_day_kuji_reset(){
      const OmikujiData = await OmikujiModel.find({ one_day_omikuji: true });
      if (!OmikujiData) {
          logger.warn("おみくじデータが見つかりませんでした...")
          return;
      }else {
        await OmikujiModel.updateMany({ one_day_omikuji: true }, {$set: { one_day_omikuji: false }})
      }
    }
    cron.schedule('0 0 0 * * *', () => {
      one_day_kuji_reset()
    })
}