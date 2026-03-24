/**
* Trending API (第三方 API - 已废弃)
*/
export interface TrendingResponse {
    author: string, //作者
    name: string, //项目名称
    avatar: string, //头像
    url: string, //仓库地址
    description: string, //描述
    language: string, //编程语言
    languageColor: string, //语言颜色
    stars: number, //星星
    forks: number, //
    currentPeriodStars: number //本周星星数
    builtBy: BuiltBy[] //贡献者
}

export interface BuiltBy {
    href: string, //主页地址
    avatar: string, //头像
    username: string//用户名
}

/**
 * GitHub Search Repositories API
 * https://api.github.com/search/repositories
 */
export interface GitHubSearchResponse {
    total_count: number;        // 搜索结果总数
    incomplete_results: boolean; // 结果是否不完整
    items: GitHubRepository[];   // 仓库列表
}

export interface GitHubRepository {
    id: number;                    // 仓库ID
    node_id: string;               // Node ID
    name: string;                  // 仓库名称 (如 "react")
    full_name: string;             // 完整名称 (如 "facebook/react")
    private: boolean;              // 是否私有
    owner: GitHubOwner;            // 拥有者信息
    html_url: string;              // GitHub 页面地址
    description: string | null;    // 描述
    fork: boolean;                 // 是否为 fork
    url: string;                   // API 地址
    created_at: string;            // 创建时间 (ISO 8601)
    updated_at: string;            // 更新时间 (ISO 8601)
    pushed_at: string;             // 最后推送时间 (ISO 8601)
    homepage: string | null;       // 主页地址
    size: number;                  // 大小 (KB)
    stargazers_count: number;      // Star 数量
    watchers_count: number;        // Watch 数量
    language: string | null;       // 主要编程语言
    forks_count: number;           // Fork 数量
    open_issues_count: number;     // 未解决的 Issue 数量
    default_branch: string;        // 默认分支
    score: number;                 // 搜索相关性得分
    topics?: string[];             // 主题标签
    license?: GitHubLicense | null;// 许可证
}

export interface GitHubOwner {
    login: string;               // 用户名
    id: number;                  // 用户ID
    node_id: string;             // Node ID
    avatar_url: string;          // 头像地址
    gravatar_id: string | null;  // Gravatar ID
    url: string;                 // API 地址
    html_url: string;            // GitHub 主页
    type: string;                // 类型 (User, Organization)
    site_admin: boolean;         // 是否为 GitHub 员工
}

export interface GitHubLicense {
    key: string;          // 许可证标识 (如 "mit")
    name: string;         // 许可证名称 (如 "MIT License")
    spdx_id: string;      // SPDX ID
    url: string | null;   // 许可证 URL
    node_id: string;      // Node ID
}