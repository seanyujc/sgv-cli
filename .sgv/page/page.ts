import $ from "jquery";
import moment from "moment";
import Vue from "vue";
import Component from "vue-class-component";
import HeaderBar from "../../components/headerBar";
import Common from "../../core/common";

// console.log(styles);
@Component({
  template: require("./home.html"),
  // components: { HeaderBar },
  mounted: () => {
    // const file = new File([""], "file.txt");
    const file: any = document.getElementById("file");
    console.log(file);
  },
})
export default class HomePage extends Vue {

  today: string = moment().format("YYYY-MM-DD");
  // constructor() {
  //   super();
  //   const file = new File([""], "file.txt");
  // }

  show() {
    const msg = this.today;
    // Common.showMsg(msg);
    // $("#myModal").modal();
  }

  get tomorrow() {
    const t = moment().add(7, "days");
    return t.format("YYYY-MM-DD");
  }

}
