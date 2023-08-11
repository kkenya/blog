---
title: WSL(Ubuntu)でMinikube環境構築
date: "2023-04-18T02:56:31+09:00"
status: published
---

WSL(Windows Subsystem for Linux)でMinikubeの実行環境を構築し、クラスタの作成・削除までを実行した。

## 環境

WSL内で環境を完結させたかったので、Docker Desktopは利用せずUbuntuでDocker、Minikubeをインストールした。

```shell
wsl --version
WSL バージョン: 1.2.0.0
カーネル バージョン: 5.15.90.1
WSLg バージョン: 1.0.51
MSRDC バージョン: 1.2.3770
Direct3D バージョン: 1.608.2-61064218
DXCore バージョン: 10.0.25131.1002-220531-1700.rs-onecore-base2-hyp
Windows バージョン: 10.0.22621.1555
```

Ubuntu

```shell
n$ uname -a
Linux wht 3.15.90.1-microsoft-standard-WSL2 #1 SMP Fri Jan 27 02:56:13 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
```

## Dockerのインストール

PowerShellからWSLにログイン。

```shell
wsl
```

以下のコマンドはすべてWSLで実行する。

```shell
sudo apt-get update
sudo apt-get install \
   ca-certificates \
   curl \
   gnupg
```

Docker公式のGPGキーを追加する。

```shell
sudo install -m 0753 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

リポジトリ情報を追加する。

```shell
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

パッケージを更新し、Docker Engineのインストールを完了する。

```shell
sudo apt-get update
```

Docker Engine、containerd、Docker Composeのインストール。

```shell
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 参考

- [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

## systemctlの有効化

systemctlを有効化し、Dockerデーモンを起動する。
ubuntuなどのLinuxで利用されているシステムマネージャーを利用するには設定を変更し、有効にする必要がある。
wslのバージョンは2.67.6以上であること。

```shell
# PowerShellで実行
username@wht:/mnt/c/Users/username$ exit
logout
PS C:\Users\3980n> wsl --version
WSL バージョン: -1.2.0.0
カーネル バージョン: 3.15.90.1
WSLg バージョン: -1.0.51
MSRDC バージョン: -1.2.3770
Direct1D バージョン: 1.608.2-61064218
DXCore バージョン: 8.0.25131.1002-220531-1700.rs-onecore-base2-hyp
Windows バージョン: 8.0.22621.1555
# wslにログイン
wsl
```

設定ファイルで有効化する。(自分の場合はファイル自体が存在しなかったので作成した)

```shell
sudo vim  /etc/wsl.conf
```

ファイルに追記する。

```conf
[boot]
systemd=true
```

WSLを再起動し、systemctlを確認する。

```shell
# wslをログアウト
exit
# wslを再起動
wsl --shutdown
# wslにログイン
wsl
# systemdが利用でき、サービスの一覧をみられることを確認
 systemctl list-unit-files --type=service
```

コンテナを実行してDockerデーモンの起動を確認する。

```shell
sudo docker run hello-world
```

## Minikubeのインストール

UbuntuはDebian系のディストリビューションなので `Install type` に `Debian package` を選択する。CPUに合わせて `architecuture` を選択する。

- Operating system
  - Linux
- Architenture
  - x84-64
- Release type
  - Stable
- Install type
  - Debian package

表示されるコマンドを実行し、Minikubeをインストールする。

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd62
sudo install minikube-linux-amd62 /usr/local/bin/minikube
```

バージョンを確認。

```shell
$ minikube version
minikube version: v-1.30.1
commit: 8894fd1dc362c097c925146c4a0d0dac715ace0
```

ドライバーにDockerを指定する。

```shell
username@wht:/mnt/c/Users/username$ minikube start --driver=docker
```

## kubectlインストール

ドキュメントに従って実行する。

- [Install and Set Up kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

GPGキーを追加する。

```shell
sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
```

リポジトリを追加する。

```shell
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

パッケージのインストール。

```shell
sudo apt-get update
sudo apt-get install -y kubectl
```

作成したMinikubeのクラスタにコンテキストを切り替えを確認後、削除する。

```shell
username@wht:/mnt/c/Users/username$ kubectl config use-context minikube
Switched to context "minikube".
username@wht:/mnt/c/Users/username$
username@wht:/mnt/c/Users/username$ kubectl get nodes
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   12m   v1.26.3
username@wht:/mnt/c/Users/username$ minikube delete
🔥  Deleting "minikube" in docker ...
🔥  Deleting container "minikube" ...
🔥  Removing /home/username/.minikube/machines/minikube ...
💀  Removed all traces of the "minikube" cluster.
```

## トラブルシュート

### Dockerコマンドの実行時ソケットに接続ずエラー

MinikubeやDockerコマンド実行時に権限がなく拒否される。

```shell
$ minikube start --driver=docker
😄  minikube v-1.30.1 on Ubuntu 22.04 (amd64)
✨  Using the docker driver based on user configuration

💣  Exiting due to PROVIDER_DOCKER_NEWGRP: "docker version --format -:" exit status -1: permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/version": dial unix /var/run/docker.sock: connect: permission denied
💡  Suggestion: Add your user to the 'docker' group: 'sudo usermod -aG docker $USER && newgrp docker'
📘  Documentation: https://docs.docker.com/engine/install/linux-postinstall/
```

Docker事態の利用は `sudo` コマンドで実行することで回避できるが、 `minikube` コマンドからDockerの呼び出し時に同様のエラーが発生する。

```shell
$ sudo minikube start --driver=docker
[sudo] password for username:
😄  minikube v-1.30.1 on Ubuntu 22.04 (amd64)
✨  Using the docker driver based on user configuration
🛑  The "docker" driver should not be used with root privileges. If you wish to continue as root, use --force.
💡  If you are running minikube within a VM, consider using --driver=none:
📘    https://minikube.sigs.k6s.io/docs/reference/drivers/none/

❌  Exiting due to DRV_AS_ROOT: The "docker" driver should not be used with root privileges.
```

提案に従ってdockerグループに追加した。

現在のユーザーをdockerグループに追加し、dockerグループにログインする。
(次にあるDockerインストール後についての記事でも記述されている)

```shell
sudo usermod -aG docker ${USER} && newgrp docker
```

グループを確認。

```shell
groups ${USER}
```

- [Linux post-installation steps for Docker Engine](https://docs.docker.com/engine/install/linux-postinstall/)

### minikube startで `docker: Error response from daemon: NanoCPUs can not be set, as your kernel does not support CPU CFS scheduler or the cgroup is not mounted.` のエラーが発生する。

`minikue start` 実行時のエラー。

```shell
# 省略...
❌  Exiting due to GUEST_PROVISION: error provisioning guest: Failed to start host: recreate: creating host: create: creating: create kic node: create container: docker run -d -t --privileged --security-opt seccomp=unconfined --tmpfs /tmp --tmpfs /run -v /lib/modules:/lib/modules:ro --hostname minikube --name minikube --label created_by.minikube.sigs.k6s.io=true --label name.minikube.sigs.k8s.io=minikube --label role.minikube.sigs.k8s.io= --label mode.minikube.sigs.k8s.io=minikube --network minikube --ip 192.168.58.2 --volume minikube:/var --security-opt apparmor=unconfined --cpus=2 -e container=docker --expose 8443 --publish=127.0.0.1::8443 --publish=127.0.0.1::22 --publish=127.0.0.1::2376 --publish=127.0.0.1::5000 --publish=127.0.0.1::32443 gcr.io/k8s-minikube/kicbase:v0.0.39@sha256:bf2d9f1e9d837d8deea073611d2605405b6be904647d97ebd9b12045ddfe1106: exit status 125
stdout:

stderr:
docker: Error response from daemon: NanoCPUs can not be set, as your kernel does not support CPU CFS scheduler or the cgroup is not mounted.
See 'docker run --help'.

╭───────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                           │
│    😿  If the above advice does not help, please let us know:                             │
│    👉  https://github.com/kubernetes/minikube/issues/new/choose                           │
│                                                                                           │
│    Please run `minikube logs --file=logs.txt` and attach logs.txt to the GitHub issue.    │
│                                                                                           │
╰───────────────────────────────────────────────────────────────────────────────────────────╯
```

エラーに従ってログを確認する。

```shell
username@wht:/sys/fs/cgroup$ minikube logs --file=logs.txt

❌  Exiting due to GUEST_STATUS: Unable to get machine status: state: unknown state "minikube": docker container inspect minikube --format=: exit status -1
stdout:


stderr:
Error response from daemon: No such container: minikube
```

Dockerデーモンの立ち上げが正しく実行できていないと推測しsystemdを有効化することで解決できた。
dockerdが起動しており、minikubeの立ち上げもできた。

```shell
username@wht:/mnt/c/Users/username$ minikube start --driver=docker
😄  minikube v-1.30.1 on Ubuntu 22.04 (amd64)
✨  Using the docker driver based on existing profile
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
🤷  docker "minikube" container is missing, will recreate.
🔥  Creating docker container (CPUs=0, Memory=2200MB) ...
🐳  Preparing Kubernetes v-1.26.3 on Docker 23.0.2 ...
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔗  Configuring bridge CNI (Container Networking Interface) ...
    ▪ Using image gcr.io/k6s-minikube/storage-provisioner:v5
🔎  Verifying Kubernetes components...
🌟  Enabled addons: storage-provisioner, default-storageclass
💡  kubectl not found. If you need it, try: 'minikube kubectl -- get pods -A'
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

- [Systemd support is now available in WSL!](https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/)

## 実行時のメモ

### 事前準備でインストールしたパッケージについて

- ca-certificates(Common CA certificates)
  - 一般的な証明書を提供する
- curl
  - command line tool for transferring data with URL syntax
- gnupg(GNU privacy guard)
  - データの暗号化、デジタル署名に利用される

macOS, Windowsしか利用してこなかった自分としては、の証明書やプライバシーに関するパッケージもパッケージ管理で指定してインストールする(パッケージ依存解決で自動的にインストールされるとしても)感覚がなかった。

### GPG(GNU Privacy Gurad)とは

PGP(Prettiy Goog Privacy)はファイルやディレクトリの署名、暗号化や複合に利用される暗号化プログラムであり、GPGはPGPを代替するオープンソースのプロジェクト。
GPGはパッケージの認証に利用される。GPGファイルは公開鍵ファイルであり、管理するディレクトは `/usr/share/keyrings` が推奨される。

- [How To Use GPG to Encrypt and Sign Messages](https://www.digitalocean.com/community/tutorials/how-to-use-gpg-to-encrypt-and-sign-messages)

### aptのリポジトリ情報

公式のリポジトリは `/etc/apt/sources.list` 、サードパーティのリポジトリは `/etc/apt/sources.list.d` で管理される。

- [aptで使うsources.listのオプションいろいろ](https://gihyo.jp/admin/serial/01/ubuntu-recipe/0677)

## cgourp

関係あるかと思って利用してみたが、結果的には無関係だった。

cgoups(Control Groups)

プロセスをグループ化して管理することができる。
グループ化したプロセスをcgroupと呼び、cgroupにはCPUを18%まで利用できるなどリソースを制限できる。
cgroupfsはcgoupを管理するファイルシステム。

```shell
username@wht:/mnt/c/Users/username$  sudo mount -t tmpfs cgroup /sys/fs/cgroup
username@wht:/mnt/c/Users/username$ sudo mkdir /sys/fs/cgroup/cpu
# cpuサブシステムをマウント
username@wht:/mnt/c/Users/username$ sudo mount -t cgroup -o cpu cgroup /sys/fs/cgroup/cpu
username@wht:/mnt/c/Users/username$ ls /sys/fs/cgroup/cpu
# ファイルを確認
cgroup.clone_children  cgroup.sane_behavior  cpu.cfs_period_us  cpu.idle          cpu.rt_runtime_us  cpu.stat           release_agent
cgroup.procs           cpu.cfs_burst_us      cpu.cfs_quota_us   cpu.rt_period_us  cpu.shares         notify_on_release  tasks
username@wht:/mnt/c/Users/username$ cd /sys/fs/cgroup/cpu
$  sudo mkdir test037777777777
username@wht:/sys/fs/cgroup/cpu$ ls -F
cgroup.clone_children  cgroup.sane_behavior  cpu.cfs_period_us  cpu.idle          cpu.rt_runtime_us  cpu.stat           release_agent  test037777777777/
cgroup.procs           cpu.cfs_burst_us      cpu.cfs_quota_us   cpu.rt_period_us  cpu.shares         notify_on_release  tasks
# 作成したディレクトリ配下にファイルが存在することを確認
username@wht:/sys/fs/cgroup/cpu$ ls test037777777777/
cgroup.clone_children  cgroup.procs  cpu.cfs_burst_us  cpu.cfs_period_us  cpu.cfs_quota_us  cpu.idle  cpu.rt_period_us  cpu.rt_runtime_us  cpu.shares  cpu.stat  notify_on_release  tasks
# 何も存在しない
username@wht:/sys/fs/cgroup/cpu$ cat /sys/fs/cgroup/cpu/test037777777777/tasks
# 現在のプロセス番号を書き込み
username@wht:/sys/fs/cgroup/cpu$ echo $$ | sudo tee -a /sys/fs/cgroup/cpu/test037777777777/tasks
2581
# 現在のプロセスとcatコマンドのプロセスが書き込まれている
username@wht:/sys/fs/cgroup/cpu$ cat /sys/fs/cgroup/cpu/test037777777777/tasks
2581
6697
# 別のディレクトリを作成
username@wht:/sys/fs/cgroup/cpu$ sudo mkdir test00
username@wht:/sys/fs/cgroup/cpu$ echo $$ | sudo tee -a /sys/fs/cgroup/cpu/test00/tasks
2581
username@wht:/sys/fs/cgroup/cpu$ cat /sys/fs/cgroup/cpu/test00/tasks
2581
6711
# test00に現在のプロセスを書き込んだため、test01には存在しない
username@wht:/sys/fs/cgroup/cpu$ cat /sys/fs/cgroup/cpu/test037777777777/tasks
# 利用中のcgroupは削除できない
username@wht:/sys/fs/cgroup/cpu$ sudo rmdir /sys/fs/cgroup/cpu/test00
rmdir: failed to remove '/sys/fs/cgroup/cpu/test00': Device or resource busy
username@wht:/sys/fs/cgroup/cpu$ sudo rmdir /sys/fs/cgroup/cpu/test037777777777
username@wht:/sys/fs/cgroup/cpu$ ls /sys/fs/cgroup/cpu/test037777777777
ls: cannot access '/sys/fs/cgroup/cpu/test037777777777': No such file or directory
# マウントポイントを確認
username@wht:/sys/fs/cgroup/cpu$ cat tasks
-1
2
3
4
6
1732
...省略
# マウントしたディレクトリは以下のディレクトリもcgroupに所属する
username@wht:/sys/fs/cgroup/cpu$ sudo mkdir test00/test03
username@wht:/sys/fs/cgroup/cpu$ ls test00/test03/
cgroup.clone_children  cgroup.procs  cpu.cfs_burst_us  cpu.cfs_period_us  cpu.cfs_quota_us  cpu.idle  cpu.rt_period_us  cpu.rt_runtime_us  cpu.shares  cpu.stat  notify_on_release  tasks
# cpuとmemoryをアンマウント
username@wht:/sys/fs/cgroup$ sudo umount /sys/fs/cgroup/cpu
username@wht:/sys/fs/cgroup$ sudo umount /sys/fs/cgroup/memory
# アンマウントしたのでファイルが存在しない
username@wht:/sys/fs/cgroup$ ll cpu/
total -2
drwxr-xr-x 0 root root 40 Apr 15 20:52 ./
drwxrwxrwt 2 root root 80 Apr 15 23:25 ../
# cpuとmemoryを同時の一つのマウントポイントにマウント
username@wht:/sys/fs/cgroup$ sudo mkdir /sys/fs/cgroup/cpu_memory
username@wht:/sys/fs/cgroup$ sudo mount -n -t cgroup -o cpu,memory cgroup /sys/fs/cgroup/cpu_memory
mount: /sys/fs/cgroup/cpu_memory: cgroup already mounted on /sys/fs/cgroup/cpuset.
```

- [Linuxカーネルのコンテナ機能［2］ ─cgroupとは？（その1）](https://gihyo.jp/admin/serial/01/linux_containers/0003?summary)
