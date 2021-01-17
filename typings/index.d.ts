declare module "git-clone" {
    /**
     * 拷贝git项目
     * @param repo 库名
     * @param targetPath 本地目录
     * @param opts 选项
     * @param cb 回调
     */
  export default function (
    repo: string,
    targetPath: string,
    opts?: Partial<{ shallow: boolean; git: string }>,
    cb?: (error: undefined | Error) => void
  );
  export default function (
    repo: string,
    targetPath: string,
    cb?: (error: undefined | Error) => void
  );
}
