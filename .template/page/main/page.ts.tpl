import { defineComponent } from "vue";
import { useBasePage } from "/@/app/pages/base-page";
import { useHeadMetadata } from "/@/app/core/composition/head-metadata";
import { createSingletonObject } from "/@/lib/sg-resource/src/decorator";

export default defineComponent({
  name: "<%= pascalKeyword%>Page",
  components: {},
  computed: {},
  data() {
    return {};
  },
  async serverPrefetch() {
    // todo
  },
  methods: {},
  setup() {
    useBasePage()
    const { ssrContext, setHeadMetadata } = useHeadMetadata();
    if (ssrContext) {
      ssrContext.title = "<%= pascalKeyword%> Page";
    }
    return { ssrContext, setHeadMetadata };
  },
  mounted() {
    // todo
  },
});
