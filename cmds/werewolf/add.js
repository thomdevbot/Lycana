module.exports = {
    usage: "`<cmd> [@Pseudo]` : " + __("Ajoute @Pseudo à la partie de loup-garou."),

    exec: function (msg, values) {
        try {
            if (values[1]) {
                var cnf = Config.options.modules.lg;
                var alive = Do.resolve('role', cnf.roles.alive);
                var user = Do.resolve('user', values[1]);
                if (user && user.user) {
                    user.addRole(alive).then(gm => {
                        msg.author.send({embed: embMsg(`:white_check_mark: <@${user.id}> a été ajouté.`)}).catch(throwErr);
                        gm.send({embed:
                            embMsg(`Vous avez été ajouté par ${msg.author} pour participer à la prochaine partie de Loup-garou.`
                                + `\n\nVous pouvez désormais : `
                                + `\n\t🔹 vous connecter au salon vocal : \`Loup Garou\`.`
                                + `\n\t🔹 parler sur le salon \`#${cnf.channels.village}\`.`)
                                .setColor(Do.resolve('color', msg.author.id))
                                .setThumbnail(msg.author.avatarURL)
                        }).catch(throwErr);
                        gm.send(`(ℹ - Si vous ne voyez pas le message ci-dessus tapez \`${Config.prx}embed\`)`).catch(throwErr)
                    });
                } else {
                    msg.author.send({embed: embErr(":x: tilisateur introuvable.")}).catch(throwErr);
                }
            } else {
                msg.author.send({embed: embErr(":x: Utilisateur non renseigné.")}).catch(throwErr);
            }
        } catch(e) {
            throwErr(e)
        }
        return true
    },

    load: function () {
        try {
            client.once('ready', () => {
                client.LG_MODULE = {
                    status: {
                        pf: false,
                        wolfs: false,
                        cham: false
                    },
                    player: {
                        pf: [],
                        wolfs: [],
                        cham: []
                    },
                    roles: {
                        "Amnesique":{
                            color: "#7B7163",
                                img: "http://vignette2.wikia.nocookie.net/town-of-salem/images/2/2f/Forgetful_Freddy.png/revision/latest?cb=20160826030733",
                                desc: [
                                "Il a oublié son rôle qui peut lui être dévoilé à tout moment pendant la partie.",
                            ],
                        },
                        "Ange":{
                            color: "#323133",
                                img: "http://i58.servimg.com/u/f58/17/28/79/95/carte213.jpg",
                                desc: [
                                "Le but de l'ange est de se faire éliminer dès le premier vote.",
                                "S'il réussit, la partie se termine et il a gagné. Dans le cas contraire, le jeu continue mais l'ange devient un simple villageois sans pouvoir.",
                            ],
                        },
                        "Arsoniste":{
                            color: "#323133",
                                img: "http://www.quizz.biz/uploads/quizz/129153/4_8vFZ4.jpg",
                                desc: [
                                "Son but est de tuer tous les membres du village et d'être le dernier survivant.",
                                "Il arrose chaque nuit une cible s'il le souhaite, ou alors, met le feu à ses victimes. Il ne peut pas s'arroser lui-même.",
                            ],
                        },
                        "Chaman":{
                            color: "#8CC152",
                                img: "https://cdn.discordapp.com/attachments/261842899099058176/264780680733392896/carte10.png",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous.",
                                "Chaque nuit, il dispose d'un court moment pour écouter les esprits.",
                            ],
                        },
                        "Chasseur":{
                            color: "#8CC152",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte610.png",
                                desc: [
                                "A sa mort, le chasseur doit désigner une personne qui mourra également. Il effectue automatiquement un headshot dans la tête de sa victime.",
                                "Si un chasseur amoureux est éliminé, il doit quand même tuer une personne, ce qui peut mener à une partie sans survivants. (personne n'a gagné)",
                            ],
                        },
                        "Chevalier":{
                            color: "#8CC152",
                                img: "http://ekladata.com/D3sfpjn5vQf3B59g7r5wx8RWnJs@227x225.jpg",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous.",
                                "Lorsque les Loups-Garous le dévorent, il condamne le premier Loup-Garou en-dessous de lui à mourir.",
                            ],
                        },
                        "Chien-Loup":{
                            color: "#7B7163",
                                img: "http://www.jedisjeux.net/img/800/les-loups-garous-de--49-1346413287.jpg",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous.",
                                "Au début du jeu, il peut choisir entre rester parmi le clan des Villageois ou alors de rejoindre le clan des Loups-Garous, s'il choisit de rejoindre les Loups-Garous, alors son objectif change et il doit éliminer tous les innocents.",
                            ],
                        },
                        "Corbeau":{
                            color: "#8CC152",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte116.png",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous.",
                                "Chaque nuit, il peut désigner un joueur qui se retrouvera le lendemain avec deux voix contre lui au vote.",
                            ],
                        },
                        "Cupidon" :{
                            color: "#8CC152",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte710.png",
                                desc: [
                                "Durant la nuit du premier tour de la partie (tour préliminaire), il va désigner deux personnes qui seront amoureuses jusqu'à la fin du jeu.",
                                "Si l'une des deux personnes vient à mourir, l'autre meurt immédiatement de désespoir.",
                                "Si l'un des amoureux est villageois et l'autre loup-garou, leur seul moyen de gagner est d'éliminer tous les autres (loups-garous et villageois).",
                            ],
                        },
                        "Enfant Sauvage (ES)":{
                            color: "#7B7163",
                                img: "http://wir.skyrock.net/wir/v1/resize/?c=isi&im=%2F1884%2F86111884%2Fpics%2F3136615818_1_2_uvztV2l1.png&w=300",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous.",
                                "Il choisit un modèle au début du jeu, si ce dernier meurt, il devient Loup-Garou et joue dans leur camp.",
                            ],
                        },
                        "Escort":{
                            color: "#8CC152",
                                img:"http://vignette2.wikia.nocookie.net/town-of-salem/images/d/d3/Escort.png/revision/latest?cb=20150506224645",
                                desc:[
                                "Son objectif est d'éliminer tous les Loups-Garous. Chaque nuit l'escort distrait une personne l'empêchant d'exercer son role. L'escort ne peut pas être elle-même distraite.",
                            ],
                        },
                        "Executeur":{
                            color: "#323133",
                                img: "http://vignette2.wikia.nocookie.net/town-of-salem/images/8/8c/Achievement_Executioner.png/revision/latest?cb=20140825150517",
                                desc: [
                                "Son but est de gagner seul. Il doit faire en sorte que le village vote contre la cible qui lui a été attribuée. Sa cible est un innocent.",
                                "Si sa victime meurt par le vote du village, il a gagné.",
                                "Si la victime meurt la nuit, alors il se transforme en Jester dont le seul et unique but est de mourir par le vote du village. S'il meurt par le vote du village, il gagne.",
                            ],
                        },
                        "Grand Méchant Loup":{
                            color: "#BF263C",
                                img: "http://ekladata.com/mt54Wfy4_dQa4psyNvoIHG7-QJ8.jpg",
                                desc: [
                                "Son objectif est d'éliminer tous les innocents (ceux qui ne sont pas Loups-Garous).",
                                "Chaque nuit, il se réunit avec ses compères Loups pour décider d'une victime à éliminer...",
                                "Tant qu'aucun autre loup n'est mort, il peut, chaque nuit, dévorer une victime supplémentaire.",
                            ],
                        },
                        "Idiot du village (IDV)":{
                            color: "#8CC152",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte113.png",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous. Si le village décide de l'éliminer, il ne meurt pas, les villageois l'épargnant au dernier moment. Mais il perd dès lors son droit de vote journalier.",
                            ],
                        },
                        "Infect pere des loups":{
                            color: "#BF263C",
                                img: "http://ekladata.com/_UsTNNMNoblFmeFZpfzKMiVOgaw.png",
                                desc: [
                                "Son objectif est d'éliminer tous les innocents (ceux qui ne sont pas Loups-Garous). Chaque nuit, il se réunit avec ses compères Loups pour décider d'une victime à éliminer...",
                                "Une fois dans la partie, il peut transformer la victime des loups en loup-garou ! L'infecté garde ses pouvoirs d'innocent !",
                            ],
                        },
                        "Joueur de flute (JDF)":{
                            color:  "#323133",
                                img:"http://i55.servimg.com/u/f55/18/31/96/00/carte115.png",
                                desc:[
                                "Son objectif est d'enchanter tous les joueurs vivants de la partie. Il peut enchanter jusqu'à deux personnes par nuit. Il gagne seul.",
                            ],
                        },
                        "Juge":{
                            color: "#8CC152",
                                img: "http://medias.jeuxonline.info/divers/equipe/22068/juge.jpg",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous. Il force un deuxième vote la journée. Il peut utiliser son pouvoir 2 fois par partie.",
                            ],
                        },
                        "Loup-garou (LG)":{
                            color: "#BF263C",
                            img: "http://i55.servimg.com/u/f55/18/31/96/00/carte210.png",
                            desc: [
                                "Son objectif est d'éliminer tous les innocents (ceux qui ne sont pas Loups-Garous). Chaque nuit, il se réunit avec ses compères Loups pour décider d'une victime à éliminer...",
                            ],
                        },
                        "Loup-Garou Blanc (LGB)":{
                            color: "#323133",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte910.png",
                                desc: [
                                "Son objectif est de terminer SEUL la partie. Les autres Loups-Garous croient qu'il est un loup normal, mais une nuit sur deux il peut assassiner un loup de son choix...",
                            ],
                        },
                        "Maire":{
                            color: "#8CC152",
                                img: "http://vignette2.wikia.nocookie.net/town-of-salem/images/8/8b/MoneyBag.png/revision/latest?cb=20141029221203",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous. Une fois qu'il se révèle, il obtient un double vote.",
                            ],
                        },
                        "Petite Fille (PF)":{
                            color: "#8CC152",
                                img: "https://images.discordapp.net/.eJwNyEEOhCAMAMC_8AAKDWD1Nw0SNFFLaPe02b-vyZzm6z7zcps7zIZuAPupVebu1WRyb76L9KvxONVXuYHNuB53e0wBS6SEtK7hlSku5a1EkRBTSSHnJeQClae1iH483f3-BNQiTw.BAhi2LolrTn5MEX2TOsSneq9OQg",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous.",
                                "Chaque nuit, elle peut espionner les Loups-Garous.",
                            ],
                        },
                        "Renard":{
                            color: "#8CC152",
                                img: "http://www.loups-garous-en-ligne.com/jeu/assets/images/carte24.png",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous. Chaque nuit, il peut flairer un joueur et savoir si lui ou un de ses 2 voisins fait partie du camp des loups. Si c'est le cas, il conserve son pouvoir pour la nuit suivante, en revanche si le joueur flairé et ses 2 voisins sont tous les 3 innocents, il perd son pouvoir.",
                            ],
                        },
                        "Salvateur":{
                            color: "#8CC152",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte410.png",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous. Chaque nuit, il peut protéger quelqu'un des attaques mortelles. Il ne peut pas protèger deux fois de suite la même personne.",
                            ],
                        },
                        "Sherif":{
                            color: "#8CC152",
                                img: "http://vignette2.wikia.nocookie.net/town-of-salem/images/3/3e/Sheriff.png/revision/latest?cb=20140802032529",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous. Chaque nuit il inspecte une personne dans le but de savoir s'il est suspect ou non suspect.",
                            ],
                        },
                        "Soeurs":{
                            color: "#8CC152",
                                img: "https://cdn.discordapp.com/attachments/239711948218957825/264775893996535809/9c6e949cf725db74ef200a6addb0ae3d04cc.jpeg",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous. Elle connaît l'identité de son autre soeur, et peut donc avoir confiance en ses paroles.",
                            ],
                        },
                        "Sorcière (Soso)":{
                            color: "#8CC152",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte510.png",
                                desc: [
                                "Elle dispose de deux potions : une potion de vie pour sauver une des victimes et une potion de mort pour assassiner quelqu'un.",
                            ],
                        },
                        "Survivant":{
                            color: "#8CC152",
                                img: "http://vignette2.wikia.nocookie.net/town-of-salem/images/5/57/Achievement_Survivor.png/revision/latest?cb=20140825150726",
                                desc: [
                                "Son objectif est juste de survivre, que les gagnants soient les loups, ou le village. Chaque nuit, il décide d'enfiler son gilet de protection ou non. Il dispose de 3 gilets l'immunisant des attaques mortelles."
                            ],
                        },
                        "Villageois (SV)":{
                            color: "#8CC152",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte110.png",
                                desc: [
                                "Ils sont armés de leur force de persuasion et de leur perspicacité.",
                            ],
                        },
                        "Voleur":{
                            color: "#7B7163",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte111.png",
                                desc: [
                                "Son role n'est pas fixe : il peut choisir son role parmi les deux cartes qui n'ont pas encore été distribuées.",
                            ],
                        },
                        "Voyante":{
                            color: "#8CC152",
                                img: "http://i55.servimg.com/u/f55/18/31/96/00/carte310.png",
                                desc: [
                                "Son objectif est d'éliminer tous les Loups-Garous. Chaque nuit, elle peut espionner un joueur et découvrir sa véritable identité...",
                            ],
                        },
                    }
                }
            })
        } catch(e) {
            throwErr(e)
        }
    }
}
