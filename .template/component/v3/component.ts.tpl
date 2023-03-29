import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "<%= pascalPrefix%><%= pascalKeyword%>",
  components: {},
  setup(props) {
    const state = reactive({});
    return { state };
  },
});
