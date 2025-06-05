var scenePlay = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function ScenePlay (){
        Phaser.Scene.call(this, { "key": 'scenePlay' });
    },
    init: function (){},
    preload: function(){
        this.load.image('chara', 'assets/images/chara.png');
        this.load.image('fg_loop_back', 'assets/images/fg_loop_back.png');
        this.load.image('fg_loop', 'assets/images/fg_loop.png');
        this.load.image('obstc', 'assets/images/obstc.png');
        this.load.image('panel_skor', 'assets/images/panel_skor.png');
        this.load.audio('snd_dead', 'assets/audio/dead.mp3');
        this.load.audio('snd_klik_1', 'assets/audio/klik_1.mp3');
        this.load.audio('snd_klik_2', 'assets/audio/klik_2.mp3');
        this.load.audio('snd_klik_3', 'assets/audio/klik_3.mp3');
    },
    
      create: function(){
        this.timerHalangan = 0;
        this.halangan = [];
        this.background = [];
        this.isGameRunning = false;
        this.score = 0;
        //menambahkan sprite karakter pada game
        this.chara = this.add.image(130, 768/2, 'chara');
        this.chara.setDepth(3);
        //membuat scale karakter menjadi 0 (tidak terlihat)
        this.chara.setScale(0);
        this.charaTweens = this.charaTweens = this.tweens.add({
            targets: this.chara,
            ease: 'Power1',
            duration: 750,
            y: this.chara.y + 200
        });
        //membuat panel nilai
        this.panel_score = this.add.image(1024/2, 60, 'panel_skor');
        this.panel_score.setOrigin(0.5);
        this.panel_score.setDepth(10);
        this.panel_score.setAlpha(0.8);

        //membuat label nilai pada panel dengan nilai yang
        //diambil dari variabel this.score
        this.label_score = this.add.text(this.panel_score.x + 25, this.panel_score.y, this.score);
        this.label_score.setOrigin(0.5);
        this.label_score.setDepth(10);
        this.label_score.setFontSize(30);
        this.label_score.setTint(0xff732e);
        //=========== CUSTOM FUNCTION ===========
        this.gameOver = function(){
            //inisialisasi variabel global highscore dengan nilai awal 0
            //jika belum ada nilai yang pernah tersimpan, namun jika sudah
            //pernah ada nilai yang tersimpan, akan mengambil dari nilai
            //terakhir yang tersimpan
            let highScore = localStorage["highscore"] || 0;
            //jika nilai lebih besar dari nilai tertinggi
            if(myScene.score > highScore){
                localStorage["highscore"] = myScene.score;
            }
            //berpindah menuju scene menu,
            //pastikan nama scene sesuai
            myScene.scene.start("sceneMenu");
        };

        //=========== DETEKSI USER INPUT ===========

        //menambahkan deteksi ketika pointer dilepaskan untuk menurunkan
        //karakter ketika user melepaskan klik pada canvas game
        this.input.on('pointerup', function(pointer, currentlyOver){
            //jika this.isGameRunning bernilai false, maka kode di bawahnya
            //tidak akan dijalankan
            if(!this.isGameRunning) return;
        
            //acak sound dalam array (0-2)
            this.snd_click[Math.floor(Math.random() * 3)].play();
            this.charaTweens = this.tweens.add({
            targets: this.chara,
            ease: 'Power1',
            duration: 750,
            y: this.chara.y + 200
            });
        }, this);
        var myScene = this;
        //animasi scale karakter menjadi 1 (terlihat di tampilan)
        this.tweens.add({
          delay: 250,
          targets: this.chara,
          ease: 'Back.Out',
          duration: 500,
          scaleX: 1,
          scaleY: 1,
          onComplete: function () {
            myScene.isGameRunning = true;
          }
        });

        //membuat variabel sound ketika karakter bertabrakan dengan halangan
        this.snd_dead = this.sound.add('snd_dead');
        //membuat variabel sound, dimasukkan ke dalam array
        //karena akan dimainkan acak salah satu ketika karakter diklik
        this.snd_click = [];
        this.snd_click.push(this.sound.add('snd_klik_1'));
        this.snd_click.push(this.sound.add('snd_klik_2'));
        this.snd_click.push(this.sound.add('snd_klik_3'));
        //mengatur volume klik 50%
        for (let i = 0; i < this.snd_click.length; i++){
            this.snd_click[i].setVolume(0.5);
        }
        

        //variabel pengganti angka
        var bg_x = 1366/2;

        //perulangan sebanyak 2x
        for(let i = 0; i < 2; i++){
            //array background baru
            var bg_awal = [];
            //membuat background dan foreground
            var BG = this.add.image(bg_x, 768/2, 'fg_loop_back');
            var FG = this.add.image(bg_x, 768/2, 'fg_loop');
            //menambahkan custom data
            BG.setData('kecepatan',2);
            FG.setData('kecepatan',4);
            FG.setDepth(2);
            //memasukkan background dan foreground ke dalam array baru
            bg_awal.push(BG);
            bg_awal.push(FG);
            //memasukkan array background
            this.background.push(bg_awal);
            //menambah nilai bg_x untuk perulangan selanjutnya
            bg_x += 1366;
        }  
        },

    update: function () {
        //sama saja dengan if (this.isGameRunning == true)
        if(this.isGameRunning){
            //karakter
            //sifat karakter, naik 5 pixel setiap frame
            //sama dengan this.chara.y = this.chara.y - 5
            this.chara.y -= 5;
        
            //batas karakter agar karakter tidak bisa jauh ke bawah
            if(this.chara.y > 690) this.chara.y = 690;

            //mengakses array
            for(let i = 0; i < this.background.length; i++){
                //mengakses array di dalam array
                for(var j = 0; j < this.background[i].length; j++){
                    //mengambil data kecepatan, lalu mengurangi nilai x
                    //sebanyak kecepatan tersebut
                    this.background[i][j].x -= this.background[i][j].getData('kecepatan');
                    //atur ulang posisi jika posisi sudah berada di kiri canvas
                    //karena titik posisi adalah tengah dan ukuran background adalah 1366
                    //maka background akan tidak terlihat ketika mencapai posisi minus 1366/2
                    if(this.background[i][j].x <= -(1366/2)){
                        //digunakan untuk pengaturan ulang posisi agar tidak ada jarak antar background
                        //misal, posisi x background adalah -685, selisih 2 pixel dengan -(1366/2) = -682
                        //selisih tersebut akan ditambahkan untuk pengaturan ulang posisi
                        var diff = this.background[i][j].x + (1366/2);
                        //mengatur ulang posisi menjadi di sebelah kanan canvas + selisih akhir
                        //sebelum atur ulang posisi
                        this.background[i][j].x = 1366 + 1366/2 + diff;
                    }
                }
            }

            //jika this.timerHalangan adalah 0, maka buat peluru baru
            if(this.timerHalangan == 0){
                //mendapatkan angka acak antara 60 hingga 680
                var acak_y = Math.floor((Math.random() * 621) + 60);
                //membuat peluru baru dengan posisi x 1500 (kanan),
                //dan posisi y acak antara 60 - 680
                var halanganBaru = this.add.image(1500, acak_y, 'obstc');
                //mengubah titik posisi (anchor point) berada di kiri, bukan di tengah
                halanganBaru.setOrigin(0,0);
                halanganBaru.setData("status_aktif",true);
                halanganBaru.setData("kecepatan", Math.floor((Math.random() * 15) + 10));
                halanganBaru.setDepth(5);
                //memasukkan peluru ke dalam array agar dapat diakses kembali
                this.halangan.push(halanganBaru);
                //mengatur ulang waktu untuk memunculkan halangan selanjutnya
                //acak antara 10 sampai 50 frame
                this.timerHalangan = Math.floor((Math.random() * 50) + 10);
            }

            //mengakses array halangan
            for(let i = this.halangan.length - 1; i >= 0; i--){
                //menggerakkan halangan sebanyak kecepatan perframe
                this.halangan[i].x -= this.halangan[i].getData("kecepatan");
                //jika halangan sudah di posisi kurang dari -200 (sudah tidak terlihat)
                if(this.halangan[i].x < -200){
                    //hancurkan halangan untuk mengurangi beban memori
                    this.halangan[i].destroy();
                    //hapus dari array halangan yang sudah dihancurkan
                    this.halangan.splice(i, 1);
                    break;
                }
            }
            this.timerHalangan--;
            
            for (var i = this.halangan.length - 1; i >= 0; i--) {
                //jika posisi halangan +50 lebih kecil dari karakter dan status halangan masih aktif
                if (this.chara.x > this.halangan[i].x + 50 && this.halangan[i].getData('status_aktif') == true) {
                    //ubah status halangan menjadi tidak aktif
                    this.halangan[i].setData("status_aktif", false);
                    //tambahkan nilai sebanyak 1 poin
                    this.score++;
                    //ubah label menjadi nilai terbaru
                    this.label_score.setText(this.score);
                }
            }

            for (let i = this.halangan.length - 1; i >= 0; i--) {
                //jika rect chara mengenai titik posisi halangan
                if (this.chara.getBounds().contains(this.halangan[i].x, this.halangan[i].y)) {
                    //ubah status halangan menjadi tidak aktif
                    this.halangan[i].setData("status_aktif", false);
                    //ubah status game
                    this.isGameRunning = false;
                    //memainkan suara karakter kalah
                    this.snd_dead.play();
                    //melakukan cek variabel penampung animasi karakter
                    //sebelum menghentikan animasi karakter
                    if (this.charaTweens != null) {
                        this.charaTweens.stop();
                    }
                    //membuat objek pengganti this, karena this tidak dapat diakses
                    //pada onComplete secara langsung
                    var myScene = this;
                    //membuat animasi kalah
                    this.charaTweens = this.tweens.add({
                        targets: this.chara,
                        ease: 'Elastic.easeOut',
                        duration: 2000,
                        alpha: 0,
                        //memanggil fungsi gameOver() setelah animasi selesai
                        onComplete: myScene.gameOver
                    });
                    //menghentikan looping jika sudah terpenuhi pengecekannya
                    break;
                }
                if (this.chara.y < -50) {
                    //ubah status game
                    this.isGameRunning = false;
                    //memainkan suara karakter kalah
                    this.sbnd_dead.play();
                    //melakukan cek variabel penampung animasi karakter
                    //sebelum menghentikan animasi karakter
                    if (this.charaTweens != null) {
                        this.charaTweens.stop();
                    }
                    //membuat objek pengganti this
                    let myScene = this;
                    //membuat animasi kalah
                    this.charaTweens = this.tweens.add({
                        targets: this.chara,
                        ease: 'Elastic.easeOut',
                        duration: 2000,
                        alpha: 0,
                        //memanggil fungsi gameOver setelah animasi selesai
                        onComplete: myScene.gameOver
                    });
                }
            }
        }
    }
});