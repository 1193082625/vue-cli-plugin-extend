/*
 * @Author: ECHO
 * @Date: 2021-03-18 15:01:36
 * @LastEditTime: 2021-03-18 15:02:19
 * @LastEditors: Please set LastEditors
 * @Description: 
 */
import Mock from "mockjs";
export default {
  getDetail: () => {
    const data = Mock.mock({
      name: Mock.Random.cname(),
      region: Mock.Random.city(),
      courseNum: Mock.Random.natural(),
      masterPic: Mock.Random.image(),
      coachPhoto: Mock.Random.image(),
      tags: () => {
        const tagsArr = [];
        for(let i = 0; i < 3; i++){
          tagsArr.push({
            id: Mock.Random.id(),
            tag: Mock.Random.cword()
          });
        };
        return tagsArr;
      },
      coachIntro: Mock.Random.csentence(),
      venuesList: () => {
        const venuesArr = [];
        for(let i = 0; i < 2; i++){
          venuesArr.push({
            id: 1,
            title: '月野兔活力健身（怀特店）'
          });
        };
        return venuesArr;
      },
      liveList: () => {
        const liveArr = [];
        for(let i = 0; i < 4; i++){
          liveArr.push({
            id: Mock.Random.id(),
            img: Mock.Random.image(),
            title: Mock.Random.ctitle(),
            coachPhoto: Mock.Random.image(),
            coachName: Mock.Random.cname(),
            courseStartTime: Mock.Random.time('HH:mm'),
            courseEndTime: Mock.Random.time('HH:mm'),
            evaluate: Mock.Random.csentence(),
            price: Mock.Random.float(1, 300, 2, 2),
            memberPrice: '2折'
          });
        };
        return liveArr;
      },
      videoList: () => {
        const videoArr = [];
        for(let i = 0; i < 4; i++){
          videoArr.push({
            id: Mock.Random.id(),
            img: Mock.Random.image(),
            title: Mock.Random.ctitle(),
            coachPhoto: Mock.Random.image(),
            coachName: Mock.Random.cname(),
            duration: '01:30:26',
            evaluate: Mock.Random.csentence(),
            price: Mock.Random.float(1, 300, 2, 2),
            memberPrice: '2折',
            date: Mock.Random.date('yyyy-MM-dd'),
          });
        };
        return videoArr;
      }
    });
    return {
      code: 200,
      msg: '',
      data
    };
  }
};
