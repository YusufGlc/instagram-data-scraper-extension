
export default class InstaData {

    constructor(useranme, userid) {
        this.useranme = useranme
        this.userid = userid
    }


    async getFollowData(option = {}) {

        let query_hash

        switch (option.type) {
            case 'followers':
                query_hash = 'c76146de99bb02f6415203be841dd25a'
                break;

            case 'followings':
                query_hash = 'd04b0a864b4b54837c0d870b0e77e076'
                break;
            default:
                throw 'type option not setted';
        }

        let res = await fetch(
            `https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables=` +
            encodeURIComponent(
                JSON.stringify({
                    id: this.userid,
                    include_reel: false,
                    fetch_mutual: false,
                    first: 50,
                    after: option.after,
                })
            ))

        return await res.json()

    }

    async getCount(type) {

        let res = await this.getFollowData({ type: type })


        switch (type) {
            case 'followers':
                return res.data.user.edge_followed_by.count

            case 'followings':
                return res.data.user.edge_follow.count
        }


    }

    async listFollowData(type, delay, callback) {

        let edge_title

        switch (type) {
            case 'followers':
                edge_title = 'edge_followed_by'
                break;
            case 'followings':
                edge_title = 'edge_follow'
                break;
        }

        let hasPage = true

        let after

        while (hasPage) {

            await new Promise((resolve) => {
                setTimeout(resolve, delay);
            })

            let res = await this.getFollowData({ type, after })

            let edge_follow = res.data.user[edge_title]

            let users = edge_follow.edges

            for (let i = 0; i < users.length; i++) {
                const user = users[i];

                callback(user.node)
            }

            if (edge_follow.page_info.has_next_page) {
                hasPage = true
                after = edge_follow.page_info.end_cursor
            } else {
                hasPage = false
                console.log('finish')
                console.log(document.querySelectorAll('li').length)
            }

        }

    }


}