import $ from "jquery";
import Vue from "vue";
import Component from "vue-class-component";
import Common from "../../core/common";

// console.log(styles);
@Component({
  template: require("./<%= keyword%>.html"),
  // components: { HeaderBar },
  mounted: () => {
    // const file = new File([""], "file.txt");
    const file: any = document.getElementById("file");
    console.log(file);
  },
})
export default class <%= uFKeyword%>Page extends Vue {

  title: string = "<%= uFKeyword%>";

  show() {
    alert(this.title);
  }

  get tomorrow() {
    return new Date();
  }

}
