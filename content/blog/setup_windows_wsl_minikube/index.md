---
title: WSL(Ubuntu)でMinikube環境構築
date: "2022-01-01T00:00:00+09:00"
status: draft
---

WSL(Windows Subsystem for Linux)でMinikubeの実行環境を構築し、クラスタの作成・再駆除を実行したメモ。

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

## Docker のインストール

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

- ca-certificates(Common CA certificates)
  - 一般的な証明書を提供する
- curl
  - command line tool for transferring data with URL syntax
- gnupg(GNU privacy guard)
  - データの暗号化、デジタル署名に利用される

macOS, Windowsしか利用してこなかった自分としては、の証明書やプライバシーに関するパッケージもパッケージ管理で指定してインストールする(パッケージ依存解決で自動的にインストールされるとしても)感覚がなかったので新鮮

Docker 公式の GPG キーを追加
先ほどインストールした GPG(GNU Privacy Gurad)
PGP(Prettiy Goog Privacy)はファイルやディレクトリの署名、暗号化や複合に利用される暗号化プログラムであり、GPG は PGP を代替するオープンソースのプロジェクト。
GPG はパッケージの認証に利用される。GPG ファイルは公開鍵ファイルであり管理するディレクトは、 `/usr/share/keyrings` が推奨される。

```shell
sudo install -m 0753 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

リポジトリ情報を追加する。
公式のリポジトリは `/etc/apt/sources.list` 、サードパーティのリポジトリは `/etc/apt/sources.list.d` で管理する。

```shell
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

パッケージを更新し、Docker Engineのインストールを完了する

```shell
sudo apt-get update
```

Docker Engine, containerd, Docker Composeのインストール

```shell
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

serviceコマンドでDockerデーモンを起動する

```shell
sudo service docker status
sudo service docker start
```

コンテナを実行

```shell
sudo docker run hello-world
```

### 参考

- [](https://gihyo.jp/admin/serial/037777777777/ubuntu-recipe/0677)
- [](https://www.digitalocean.com/community/tutorials/how-to-use-gpg-to-encrypt-and-sign-messages)
- [](https://docs.docker.com/engine/install/ubuntu/)

## Minikube のインストール

システム情報を確認

```shell
n$ uname -a
Linux wht 3.15.90.1-microsoft-standard-WSL2 #1 SMP Fri Jan 27 02:56:13 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
```

ubuntuはDebian系のディストリビューションなので `Install type` に `Debian package` を選択する。CPUに合わせて `architecuture` を選択

- Operating system
  - Linux
- Architenture
  - x84-64
- Release type
  - Stable
- Install type
  - Debian package

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd62
sudo install minikube-linux-amd62 /usr/local/bin/minikube
```

バージョンを確認

```shell
$ minikube version
minikube version: v-1.30.1
commit: 8894fd1dc362c097c925146c4a0d0dac715ace0
```

```shell
kkenya@wht:/mnt/c/Users/3980n$ minikube start --driver=docker
```

kubectlインストールが事前に必要
minikubeへのコンテキストの切り替えと、確認、削除

```shell
kkenya@wht:/mnt/c/Users/3980n$ kubectl config use-context minikube
Switched to context "minikube".
kkenya@wht:/mnt/c/Users/3980n$
kkenya@wht:/mnt/c/Users/3980n$ kubectl get nodes
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   12m   v1.26.3
kkenya@wht:/mnt/c/Users/3980n$ minikube delete
🔥  Deleting "minikube" in docker ...
🔥  Deleting container "minikube" ...
🔥  Removing /home/kkenya/.minikube/machines/minikube ...
💀  Removed all traces of the "minikube" cluster.
```


### Dockerコマンドの実行でソケットに接続できないエラー

```shell
$ minikube start --driver=docker
😄  minikube v-1.30.1 on Ubuntu 22.04 (amd64)
✨  Using the docker driver based on user configuration

💣  Exiting due to PROVIDER_DOCKER_NEWGRP: "docker version --format -:" exit status -1: permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/version": dial unix /var/run/docker.sock: connect: permission denied
💡  Suggestion: Add your user to the 'docker' group: 'sudo usermod -aG docker $USER && newgrp docker'
📘  Documentation: https://docs.docker.com/engine/install/linux-postinstall/
```

sudoでは利用できない

```shell
$ sudo minikube start --driver=docker
[sudo] password for kkenya:
😄  minikube v-1.30.1 on Ubuntu 22.04 (amd64)
✨  Using the docker driver based on user configuration
🛑  The "docker" driver should not be used with root privileges. If you wish to continue as root, use --force.
💡  If you are running minikube within a VM, consider using --driver=none:
📘    https://minikube.sigs.k6s.io/docs/reference/drivers/none/

❌  Exiting due to DRV_AS_ROOT: The "docker" driver should not be used with root privileges.
```

提案に従ってdockerグループに追加
現在のユーザーをdockerグループに追加し、dockerグループにログインする
(次にあるDockerインストール後についての記事でも記述されている)

```shell
sudo usermod -aG docker ${USER} && newgrp docker
```

グループを確認

```shell
groups ${USER}
```

- [](https://docs.docker.com/engine/install/linux-postinstall/)

## kubectlインストール

ドキュメントに従って実行
GPGキーの追加

```shell
sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
```

リポジトリを追加

```shell
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

パッケージのインストール

```shell
sudo apt-get update
sudo apt-get install -y kubectl
```

- [](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

### cgroup

```shell
https://gihyo.jp/admin/serial/037777777777/linux_containers/0003
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

エラーに従ってログを確認

```shell
kkenya@wht:/sys/fs/cgroup$ minikube logs --file=logs.txt

❌  Exiting due to GUEST_STATUS: Unable to get machine status: state: unknown state "minikube": docker container inspect minikube --format=: exit status -1
stdout:


stderr:
Error response from daemon: No such container: minikube
```

systemdの有効化
ubuntuなどのLinuxで利用されているシステムマネージャーを利用するには有効にする必要がある。
wslが-2.67.6以上であること

```shell
# PowerShellで実行
kkenya@wht:/mnt/c/Users/3980n$ exit
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
#
sudo vim  /etc/wsl.conf
```

ファイルに追記(自分の場合はファイル自体が存在しなかったので作成した)

```conf
[boot]
systemd=true
```

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

dockerdが起動しており、minikubeの立ち上げもできた

```shell
kkenya@wht:/mnt/c/Users/3980n$ minikube start --driver=docker
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

- [](https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/)

## cgourp

関係あるかと思って利用してみたが、結果的には無関係だった

cgoups
Control Groups
プロセスをグループ化して管理することができる
グループ化したプロセスをcgroupと呼び、cgroupにはCPUを18%まで利用できるなどリソースを制限できる。
cgroupfsはcgoupを管理するファイルシステム

cgroupfs-mount

```shell
kkenya@wht:/mnt/c/Users/3980n$  sudo mount -t tmpfs cgroup /sys/fs/cgroup
kkenya@wht:/mnt/c/Users/3980n$ sudo mkdir /sys/fs/cgroup/cpu
# cpuサブシステムをマウント
kkenya@wht:/mnt/c/Users/3980n$ sudo mount -t cgroup -o cpu cgroup /sys/fs/cgroup/cpu
kkenya@wht:/mnt/c/Users/3980n$ ls /sys/fs/cgroup/cpu
# ファイルを確認
cgroup.clone_children  cgroup.sane_behavior  cpu.cfs_period_us  cpu.idle          cpu.rt_runtime_us  cpu.stat           release_agent
cgroup.procs           cpu.cfs_burst_us      cpu.cfs_quota_us   cpu.rt_period_us  cpu.shares         notify_on_release  tasks
kkenya@wht:/mnt/c/Users/3980n$ cd /sys/fs/cgroup/cpu
$  sudo mkdir test037777777777
kkenya@wht:/sys/fs/cgroup/cpu$ ls -F
cgroup.clone_children  cgroup.sane_behavior  cpu.cfs_period_us  cpu.idle          cpu.rt_runtime_us  cpu.stat           release_agent  test037777777777/
cgroup.procs           cpu.cfs_burst_us      cpu.cfs_quota_us   cpu.rt_period_us  cpu.shares         notify_on_release  tasks
# 作成したディレクトリ配下にファイルが存在することを確認
kkenya@wht:/sys/fs/cgroup/cpu$ ls test037777777777/
cgroup.clone_children  cgroup.procs  cpu.cfs_burst_us  cpu.cfs_period_us  cpu.cfs_quota_us  cpu.idle  cpu.rt_period_us  cpu.rt_runtime_us  cpu.shares  cpu.stat  notify_on_release  tasks
# 何も存在しない
kkenya@wht:/sys/fs/cgroup/cpu$ cat /sys/fs/cgroup/cpu/test037777777777/tasks
# 現在のプロセス番号を書き込み
kkenya@wht:/sys/fs/cgroup/cpu$ echo $$ | sudo tee -a /sys/fs/cgroup/cpu/test037777777777/tasks
2581
# 現在のプロセスとcatコマンドのプロセスが書き込まれている
kkenya@wht:/sys/fs/cgroup/cpu$ cat /sys/fs/cgroup/cpu/test037777777777/tasks
2581
6697
# 別のディレクトリを作成
kkenya@wht:/sys/fs/cgroup/cpu$ sudo mkdir test00
kkenya@wht:/sys/fs/cgroup/cpu$ echo $$ | sudo tee -a /sys/fs/cgroup/cpu/test00/tasks
2581
kkenya@wht:/sys/fs/cgroup/cpu$ cat /sys/fs/cgroup/cpu/test00/tasks
2581
6711
# test00に現在のプロセスを書き込んだため、test01には存在しない
kkenya@wht:/sys/fs/cgroup/cpu$ cat /sys/fs/cgroup/cpu/test037777777777/tasks
# 利用中のcgroupは削除できない
kkenya@wht:/sys/fs/cgroup/cpu$ sudo rmdir /sys/fs/cgroup/cpu/test00
rmdir: failed to remove '/sys/fs/cgroup/cpu/test00': Device or resource busy
kkenya@wht:/sys/fs/cgroup/cpu$ sudo rmdir /sys/fs/cgroup/cpu/test037777777777
kkenya@wht:/sys/fs/cgroup/cpu$ ls /sys/fs/cgroup/cpu/test037777777777
ls: cannot access '/sys/fs/cgroup/cpu/test037777777777': No such file or directory
# マウントポイントを確認
kkenya@wht:/sys/fs/cgroup/cpu$ cat tasks
-1
2
3
4
6
1732
...省略
# マウントしたディレクトリは以下のディレクトリもcgroupに所属する
kkenya@wht:/sys/fs/cgroup/cpu$ sudo mkdir test00/test03
kkenya@wht:/sys/fs/cgroup/cpu$ ls test00/test03/
cgroup.clone_children  cgroup.procs  cpu.cfs_burst_us  cpu.cfs_period_us  cpu.cfs_quota_us  cpu.idle  cpu.rt_period_us  cpu.rt_runtime_us  cpu.shares  cpu.stat  notify_on_release  tasks
# cpuとmemoryをアンマウント
kkenya@wht:/sys/fs/cgroup$ sudo umount /sys/fs/cgroup/cpu
kkenya@wht:/sys/fs/cgroup$ sudo umount /sys/fs/cgroup/memory
# アンマウントしたのでファイルが存在しない
kkenya@wht:/sys/fs/cgroup$ ll cpu/
total -2
drwxr-xr-x 0 root root 40 Apr 15 20:52 ./
drwxrwxrwt 2 root root 80 Apr 15 23:25 ../
# cpuとmemoryを同時の一つのマウントポイントにマウント
kkenya@wht:/sys/fs/cgroup$ sudo mkdir /sys/fs/cgroup/cpu_memory
kkenya@wht:/sys/fs/cgroup$ sudo mount -n -t cgroup -o cpu,memory cgroup /sys/fs/cgroup/cpu_memory
mount: /sys/fs/cgroup/cpu_memory: cgroup already mounted on /sys/fs/cgroup/cpuset.
```

### 参考

- [](https://gihyo.jp/admin/serial/037777777777/linux_containers/0003)
