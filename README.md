# coding-note

代码笔记

## 生成 ssh

```sh
ssh-keygen -t rsa -C "764937567@qq.com"

ssh-agent bash
ssh-add  ~/.ssh/id_rsa
```

## 配置多个 ssh

`D:\softwares\Git\etc\ssh\ssh_config`

```ini
# github
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile C:/Users/admin/.ssh/github_id_rsa

# gitlab
Host 192.168.20.10
HostName gitlab.com
PreferredAuthentications publickey
IdentityFile C:/Users/admin/.ssh/id_rsa
```
