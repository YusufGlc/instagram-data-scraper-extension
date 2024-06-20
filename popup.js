import InstaData from "./instaData.js";
let followers_text = document.querySelector('#Followers')
let followings_text = document.querySelector('#Followings')
let followers_list = document.querySelector('#followers_list')

async function getUserID(username) {

    if (!username) {
        throw 'username empty'
    }

    let res = await fetch('https://www.instagram.com/' + username)

    res = await res.text()

    let regex = res.match(/"props":{"id":"\d+"/g)

    if (!regex) {
        alert('Wrong username !')
        throw Error('wrong username')
    }

    res = JSON.parse('{' + regex[0] + '}}')

    console.log(res)


    return res.props.id


}



document.querySelector('#Check').onclick = async () => {

    let username = document.querySelector('#username').value

    let url = document.querySelector('#url')

    let userid = await getUserID(username)

    let instaData = new InstaData(username, userid)

    url.textContent = 'https://www.instagram.com/' + username
    url.href = 'https://www.instagram.com/' + username


    let [followers_count, followings_count] = await Promise.all([instaData.getCount('followers'), instaData.getCount('followings')])

    followers_text.textContent = followers_count
    followings_text.textContent = followings_count

    let process_percentage = document.querySelector('#process_percentage')

    let delay = 1000


    document.querySelector('#export_followers').onclick = async () => {

        let followers_data = []

        await instaData.listFollowData('followers', delay, (user) => {
            followers_data.push([user.username])
            process_percentage.textContent = Math.round(followers_data.length / followers_count * 100)
        })

        var workbook = XLSX.utils.book_new();
        workbook.SheetNames.push('Followers');
        workbook.Sheets['Followers'] = XLSX.utils.aoa_to_sheet(followers_data);

        XLSX.writeFile(workbook, username + ' followers.xlsx');

    }

    document.querySelector('#export_followings').onclick = async () => {

        let followings_data = []

        await instaData.listFollowData('followings', delay, (user) => {
            followings_data.push([user.username])
            process_percentage.textContent = Math.round(followings_data.length / followings_count * 100)
        })

        var workbook = XLSX.utils.book_new();
        workbook.SheetNames.push('Followings');
        workbook.Sheets['Followings'] = XLSX.utils.aoa_to_sheet(followings_data);

        XLSX.writeFile(workbook, username + ' followings.xlsx');

    }






}