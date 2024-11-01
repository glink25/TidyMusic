# TidyMusic

这是一个用于在线匹配音乐metadata标签的软件，使用tauri开发。可以快速查询歌曲标签。
目前只提供Apple Silicon release，其他系统需要自行打包

# Features
1. 支持网易云标签源
2. 支持iTunes标签源
3. 歌曲列表筛选
4. 右键菜单
5. 多语言

# Todo List
1. 支持自定义标签源
2. 自动批量匹配标签源

# Issues
1. 保存修改时会对原始标签进行覆盖修改，如果有未支持的标签信息会被统一放置到ID3v2.3 comment标签中，可能会导致丢失一些原始歌曲标签信息
