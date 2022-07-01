
// Я разбирался с работой алгоритма пошагово реализовывая
// задачу генерации заданого слова из случайных букв

function random(min, max) {

    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min
}

function generateLetter() {
    const code = random(97, 123); // ASCII char codes
    return String.fromCharCode(code)
}

class Member {
    constructor(target) {
        this.target = target
        this.keys = [];


        for ( let i = 0; i < target.length; i += 1) {
            this.keys[i] = generateLetter();
        }
    }

    fitness() {
        let match = 0;

        for (let i = 0; i < this.keys.length; i += 1) {
            if (this.keys[i] === this.target[i]) {
                match += 1
            }
        }

        return match / this.target.length
    }

    crossover(partner) {

        const { length } = this.target

        const child = new Member(this.target)
        const midpoint = random(0, length)

        for (let i = 0; i < length; i++) {
            if (i > midpoint) {
                child.keys[i] = this.keys[i];
            } else {
                child.keys[i] = partner.keys[i];
            }
        }
        return child
    }

    mutate(mutationRate) {
        for (let i = 0; i < this.keys.length; i++) {
            if (Math.random() < mutationRate) {
                this.keys[i] = generateLetter()
            }
        }
    }
}

class Population {
    constructor(size, target, mutationsRate) {
        size = size || 1;
        this.members = [];
        this.mutationsRate = mutationsRate

        for (let i = 0; i < size; i++) {
            this.members.push(new Member(target));
        }
    }

    selectMemberForMating() {
        const matingPool = [];

        this.members.forEach((m)=>{
            const f = Math.floor(m.fitness() * 100) || 1


            for (let i = 0; i < f; i++) {
                matingPool.push(m)
            }
        })
        return matingPool
    }

    reproduce(matingPool) {
        for (let i = 0; i < this.members.length; i ++) {
            const parentA = matingPool[random(0, matingPool.length)]
            const parentB = matingPool[random(0, matingPool.length)]

            const child = parentA.crossover(parentB)

            child.mutate(this.mutationsRate)

            this.members[i] = child
        }
    }

    evolve(generations) {
        for (let i = 0; i < generations; i += 1) {
            const pool = this.selectMemberForMating();
            this.reproduce(pool);
        }
    }
}

function generate(populationSize, target, mutationRate, generations) {

    const population = new Population(populationSize, target, mutationRate);
    population.evolve(generations);

    const membersKeys = population.members.map((m) => m.keys.join(''));
    const perfectCandidatesNum = membersKeys.filter((w) => w === target);


    console.log(membersKeys);
    console.log(`${perfectCandidatesNum ? perfectCandidatesNum.length : 0} member(s) typed "${target}"`);
}

generate(100, 'hello', 0.05, 5);
