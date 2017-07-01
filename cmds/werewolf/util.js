module.exports = {
    usage: "`<cmd> [Message]` : " + __("Affiche l'utilisation des commandes pour le déroulement d'une partie."),
    calldelete: false,
    pmOnly: true,
    show: true,
    restricted: {"lg_mdj": ["LG-Anim", "LG-MDJ"], "all":["Admin"]},

    exec: function (msg, values) {
        try {
            var cnf = Config.options.modules.lg

            var rmdj = Do.resolve('role',cnf.roles.mdj)
            var ralive = Do.resolve('role',cnf.roles.alive)
            var rdead = Do.resolve('role',cnf.roles.dead)
            var ranim = Do.resolve('role',cnf.roles.anim)
            var cmdj = Do.resolve('channel', cnf.channels.mdj)
            var cvillage = Do.resolve('channel', cnf.channels.village)

            cmdj.send(
                `\n**Bonjour à vous ${rmdj}, ${ranim},**`
            ).catch(throwErr)

            cmdj.send(
                [
                    `Voici l'aide complète pour l'utilisation des commandes pour le bon déroulement d'un partie de loup-garou.`,
                    ``,
                    `Premièrement vous devez ajouter le role ${ralive} à tous les joueurs présent. Ex: \`-add @Pseudo\``,
                    `Puis utilisez la commande \`-distrib\` pour la distribution des roles, si 8 joueurs ont le role ${ralive}` +
                    ` vous devrez faire une liste **à virgule** de 8 personnages comme pas exemple : LG,Salvateur,LGB,Sorcière...`,
                    ``,
                    `Les noms de personnages ne sont ni sensibles à la casse ou aux espaces.` +
                    ` (Notez que si vous utilisez les noms de personnages fourni dans la commande \`-role\` les joueurs recevront leur role en mp)`,
                    `Exécutez donc la commande : \`-distrib Perso 1, Perso 2, Perso3,PERSO4,...\` avec **1 personnage = 1 joueur**`,
                    ``,
                    `Si vous voulez 3 loups-garous il vous faudra donc faire \`[...]Loup-garou,Loup-garou,Loup-garou[...]\` dans votre liste.`,
                    `Les roles sont distribués aléatoirement et chaque joueur en sera averti en MP !`
                ].join("\n")
            ).catch(throwErr)

            cmdj.send(
                [
                    `:warning: NB: Pensez à exécuter la commande \`distrib\` dans le salon ${cmdj} sinon tout le monde verra les personnages de chacun !`,
                    ``,
                    `Ensuite ajoutez les loup-garous / Petite fille / Chaman.`,
                    ``,
                    `Pour ce faire :`,
                    `\t- Pour les loups : Utilisez \`-lg @Pseudo\``,
                    ``,
                    `\t- Pour le chaman : Utilisez \`-chaman @Pseudo\``,
                    ``,
                    `\t- Pour la petite fille : Utilisez \`-pf @Pseudo\``,
                    ``,
                    `Vous pouvez utiliser \`-panel\` pour afficher le panneau de contrôle.`,
                    `Ce panneau affiche en temps réel le status :white_check_mark: *actif* ou :x: *inactif* de ces personnages et du village.`,
                    `Pour activer/désactiver le dialogue :`,
                    ``,
                    `\t- des loups : \`-lg\``,
                    ``,
                    `\t- du chaman aves les morts : \`-chaman\``,
                    ``,
                    `\t- des loups **lu seulement** par la petite fille : \`-pf\``,
                    ``,
                    `Ou cliquez sur les réactions du panneau de contrôle.`
                ].join("\n")
            ).catch(throwErr)

            cmdj.send(
                [
                    `En tant que ${rmdj} / ${ranim} vous pouvez utiliser la commande \`vote\` pour assurer le bon déroulement du vote.`
                ].join("\n")
            ).catch(throwErr)

            cmdj.send(
                [
                    ``,
                    ``,
                    `***Le vote !***`,
                    `Pour démarrer ou arrêter un vote utilisez \`-vote\`.`,
                    ``,
                    `Vous pouvez utiliser \`-vote list\` pour voir ceux qui n'ont pas encore voté.`,
                    ``,
                    `\`-vote\` aura pour effet de faire un vote blanc. \`-vote @Pseudo\` votera pour le @Pseudo cible. Tant que les votes ne sont pas clos les votants (${ralive}) pourront changer de cible.`,
                    ``,
                    `Si vous voulez prévenir qu'un vote va arriver dans 5 minutes laissant 5 minutes aux joueurs pour se défendre vous pouvez utiliser \`-night 5m\``,
                    `Cela affichera un message puis le nombre de minutes plus tard un second alertant de la fin du temps accordé.`,
                    ``,
                    `Pour faciliter l'échange vocal les joueurs peuvent utiliser \`-parole\` sur ${cvillage} pour demander la parole.`,
                    `\`-parole clear\` pour vider la liste d'attente.`,
                    `\`-parole\` pour passer au prochain dans la liste d'attente.`,
                    ``,
                    `Lorsqu'un personnage meurt vous pouvez utiliser la commande : \`-kill @Joueur Personnage Joué\` pour lui enlever le role ${ralive}, le renommer, et lui rajouter le role ${rdead}.`,
                    ``,
                    ``,
                    `À la fin de la partie, **et seulement à la fin !** vous pouvez utiliser \`-reset\` qui réinitialisera les roles et personnages (Peut bugger si trop de monde).`
                ].join("\n")
            ).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true
    }
};
