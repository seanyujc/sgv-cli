import Vue from "vue";
import Component from "vue-class-component";
import Common from "../../core/common";

// console.log(styles);
@Component({
  template: require("./<%= keyword%>.html"),
  // components: { HeaderBar },
  mounted: () => {
    console.log("mounted");
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
