module.exports = {
    usage: "`<cmd>` : " + __("Aide complète pour afficher les messages embed des bots."),

    exec: function (msg, values) {
        try {
            msg.author.send([
                `**Bonjour à toi ${msg.author}**,`,
                `Tu sembles ne pas voir les message dit "*embed*" des bots.`,
                `Tu peux régler ce problème en suivant les étapes ci-dessous:`,
                ``,
                `🔹 **Étape 1**`,
                `Allez dans les \`Paramètres utilisateur\`.`,
                ``,
                `🔹 **Étape 2**`,
                `Choisissez dans le menu à gauche \`Texte & Images\`.`,
                ``,
                `🔹 **Étape 3**`,
                `Et vérifiez que \`PRÉVISUALISATION DE LIEN\` est bien **activé**.`
            ].join(`\n`)).catch(throwErr)
        } catch(e) {
            throwErr(e)
        }
        return true
    }
}
