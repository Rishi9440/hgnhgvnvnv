/* vidoza resolver
 * @lscofield
 * GNU
 */

const cheerio = require('cheerio');

exports.index = function (req, res) {
    const source = 'source' in req.body ? req.body.source : req.query.source;
    const html = Buffer.from(source, 'base64').toString('utf8');
    var mp4 = null;

    const $ = cheerio.load(html);

    try {
        for (var i = 0; i < $('script[type="text/javascript"]').get().length; i++) {
            const text = $('script[type="text/javascript"]').get(i);
            try {
                const s = text.children[0].data;
                if (s.includes("src:")) {
                    mp4 = s.split("src:")[1];
                    mp4 = mp4.split("\"")[1];
                    if (mp4.includes("v.mp4")) {
                        break;
                    }
                }
            } catch (rt) { }
        }

        if (mp4 == null || !mp4.includes(".mp4")) {
            mp4 = null;
        }
    } catch (e) {
        mp4 = mp4 == null ? '' : mp4;
    }

    mp4 = mp4 == null ? '' : mp4;

    res.json({ status: mp4 == '' ? 'error' : 'ok', url: mp4 });
};