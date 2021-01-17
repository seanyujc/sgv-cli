import { defineComponent } from "vue";
import { useHeadMetadata } from "/@/app/core/composition/head-metadata";
import { CommonService } from "/@/app/core/services/common.serv";
import { createSingletonObject } from "/@/lib/sg-resource/src/decorator";

export default defineComponent({
  name: "<%= pascalKeyword%>Page",
  computed: {},
  data() {
    return {};
  },
  async serverPrefetch() {
    // todo
  },
  setup() {
    const { ssrContext, setHeadMetadata } = useHeadMetadata();
    if (ssrContext) {
      ssrContext.title = "<%= pascalKeyword%> Page";
    }
    return { ssrContext, setHeadMetadata };
  },
  methods: {},
  mounted() {
    // todo
  },
});
