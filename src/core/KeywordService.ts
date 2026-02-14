export class KeywordService {

    private stopwords = new Set([
        "para", "com", "uma", "sobre", "entre",
        "objetivos", "aprendizagem", "conhecer",
        "aplicar", "conceitos", "também",
        "através", "como", "mais", "menos",
        "porque", "quando", "onde", "este",
        "essa", "isso", "aquela", "aquele",


    'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'ao', 'à', 'aos', 'às', 
    'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas', 'pelo', 'pela', 'pelos', 'pelas',
    

    'eu', 'tu', 'ele', 'ela', 'nós', 'vós', 'eles', 'elas', 'me', 'mim', 'comigo', 
    'te', 'ti', 'contigo', 'se', 'si', 'consigo', 'lhe', 'nos', 'vos', 'lhes', 
    'meu', 'minha', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'seu', 'sua', 
    'seus', 'suas', 'nosso', 'nossa', 'nossos', 'nossas', 'vosso', 'vossa', 'vossos', 'vossas',
    

    'de', 'em', 'por', 'para', 'com', 'sem', 'sob', 'sobre', 'entre', 'até', 
    'desde', 'contra', 'perante', 'através', 'além', 'dentro', 'fora', 'perto', 
    'longe', 'durante',
    

    'e', 'mas', 'ou', 'porque', 'pois', 'que', 'se', 'como', 'quando', 'embora', 
    'porém', 'todavia', 'contudo', 'então', 'também', 'apesar', 'caso', 'além disso', 
    'portanto', 'logo', 'ainda que', 'a fim de', 'com o objetivo de',
    
 
    'ser', 'estar', 'ter', 'haver', 'ir', 'vir', 'fazer', 'poder', 'dever', 
    'querer', 'saber', 'está', 'estão', 'tem', 'tenho', 'é',

    'esse', 'essa', 'isso', 'este', 'esta', 'isto', 'aquele', 'aquela', 'aquilo', 
    'aqueles', 'aquelas', 'deste', 'desta', 'destes', 'destas', 'disso', 'daquilo', 
    'nisto', 'naquilo',

    'lá', 'aqui', 'ali', 'onde', 'aonde',
    

    'ah', 'oh', 'ei', 'oi', 'olá', 'opa', 'eita', 'nossa', 'caramba', 'poxa', 
    'uau', 'xi', 'ih', 'ué', 'hein', 'que que é isso', 'quê',
    

    'cara', 'mano', 'mina', 'véi', 'velho', 'brother', 'meu', 'meu chapa', 
    'mano do céu', 'parça', 'parceiro', 'camarada', 'meu rei', 'minha rainha', 
    'bro', 'meu anjo', 'fera', 'chefe', 'paizão', 'mainha', 'veinho', 'velhinho', 
    'moleque', 'garoto', 'menino', 'menina', 'guri', 'guria', 'piá', 'piázinho', 
    'gajo', 'gaja', 'bacana', 'maneiro', 'massa', 'show', 'top', 'legal', 'beleza', 
    'joia', 'firmeza', 'daora', 'dahora', 'da hora', 'responsa', 'sinistro', 'brabo', 
    'brabíssimo', 'irado', 'supimpa', 'bala', 'zica', 'animal', 'monstro', 'mito', 'lenda',
    

    'pq', 'tb', 'tbm', 'vc', 'cê', 'ce', 'c', 'mt', 'mto', 'mta', 'td', 'tdo', 
    'tda', 'hj', 'amg', 'amigo', 'amiga', 'bjs', 'bjss', 'bjo', 'bjao', 'vlw', 
    'flw', 'fvr', 'por favor', 'abs', 'vdd', 'aff', 'pfv', 'pfvr', 'sla', 'slc', 
    'sdds', 'tmj', 'tamo junto', 'fds', 'findi', 'blz', 'bele', 'falou', 'falows', 
    'fmz', 'fmza', 'mds', 'oxe', 'oxi', 'vey', 'véi', 'vix', 'vish', 'vcs', 'tá', 
    'tô', 'tamos', 'tamo', 'cadê', 'd', 'pro', 'pra', 'q', 'qualé', 'tipo', 'né', 
    'qnd', 'aki', 'vamo', 'vambora', 'partiu', 'bora', 'falô', 'blza', 'sup', 'obg', 
    'pls', 'ñ', 'num', 'msm', 'sdd', 'pqn', 'pqns', 'agr', 'poxa', 'po', 'uai', 
    'eita', 'trem', 'bixim', 'vish', 'causo', 'sô', 'ôxe',

    'bão', 'ocê', 'oxente', 'painho', 'égua', 'bah', 'tchê', 'aham', 'ahã', 
    'orra meu', 'home', 'homi', 'muié', 'muler', 'visse', 'tu', 'num é', 'nera',

    'tipo assim', 'aí', 'pois é', 'quer dizer', 'sabe', 'entende', 'sacou', 
    'tá ligado', 'ok', 'okay', 'tranquilo', 'suave', 'de boa', 'fechou', 
    'combinado', 'entendido',

    's', 'n', 'yep', 'nop', 'ahan', 'nops', 'de jeito nenhum', 'com certeza', 
    'claro', 'óbvio', 'lógico', 'evidente', 'sem dúvida', 'quem sabe', 'vai ver', 
    'pode ser',
    

    'bastante', 'pra caramba', 'pra cacete', 'pra dedéu', 'pácas', 'biga', 
    'uma porrada', 'um monte', 'um tantão', 'um bocado', 'um tiquinho', 
    'um cadinho', 'um tico', 'uma belezura',
    

    'tá bom', 'tá bem', 'tá certo', 'pode crer', 'tô dentro', 'topo', 'vamos', 
    'bora lá', 'tá de boa',
    

    'tá nada', 'que nada', 'nem a pau', 'nem ferrando', 'nem morto', 
    'nem que a vaca tussa', 'tá louco', 'tá doido', 'nem pensar',
    

    'tchau', 'até logo', 'até mais', 'fui', 'to indo', 'té mais', 'inté', 
    'bye', 'xau', 'beijo', 'abraço', 'abç', 'fique com Deus', 'vai com Deus', 
    'se cuida', 'se cuide', 'fica bem', 'fique bem',
    

    'e aí', 'fala', 'fala aí', 'fala tu', 'salve', 'quali', 'como vai', 
    'como tá', 'tudo bem', 'tudo bom', 'eae', 'coé', 'alô',
    

    'valeu', 'obrigado', 'obrigada', 'brigado', 'brigadão', 'muito obrigado', 
    'grato', 'gratidão', 'thanks', 'thx', 'tanks', 'tenks',
    

    'rs', 'kkkk', 'haha', 'hehe', 'lol', 'risos', 'kkk', 'hahaha', 'postar', 
    'post', 'stories', 'story', 'feed', 'timeline', 'curtir', 'like', 'reagir', 
    'compartilhar', 'share', 'seguir', 'follow', 'unfollow', 'bio', 'trending', 
    'viral', 'viralizar',
    

    'será', 'será mesmo', 'não sei não', 'tô na dúvida', 'to em dúvida', 
    'vai saber', 'sei lá', 'não faço ideia', 'nem imagino',
    

    'tanto quanto', 'bem como', 'a menos que', 'a não ser que', 'conforme', 
    'à medida que', 'sempre que', 'logo que', 'assim que', 'uma vez que', 
    'na medida em que', 'de modo que', 'de forma que', 'caso contrário', 
    'fora isso', 'além do mais', 'por outro lado', 'por um lado', 
    'de uma forma ou de outra', 'apesar de tudo', 'ao contrário', 
    'em contrapartida', 'em compensação', 'por isso mesmo', 'desse modo', 
    'desta forma', 'assim sendo', 'por consequência', 'consequentemente', 
    'para tanto', 'aliás', 'inclusive', 'ademais', 'com isso', 'por assim dizer', 
    'em suma', 'afinal', 'a fim de que', 'de modo a',
    

    'você', 'vocês', 'porquê', 'entaum', 'bls', 'dexa', 'tá ligado', 'tá sabendo', 
    'tá com', 'tá ok', 'cê tá', 'ocê', 'ocês', 'nois', 'nois é', 'é nois', 
    'na moral', 'escuta só', 'né não', 'nu', 'rlx', 'susto', 'tru', 'brodi', 
    'eu to', 'eu tô', 'nois tá', 'nóis tá', 'tu tá', 'tu vai', 'c vai', 'tu vamo', 
    'tá suave', 'tá de boaça'
    ]);

    extract(content: string): string[] {

        const words = content
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/);

        const filtered = words.filter(word =>
            word.length > 2 &&
            !this.stopwords.has(word)
        );

        const frequency = new Map<string, number>();

        for (const word of filtered) {
            frequency.set(word, (frequency.get(word) || 0) + 1);
        }

        return Array.from(frequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0]);
    }
}