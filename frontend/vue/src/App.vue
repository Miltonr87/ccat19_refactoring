<script setup lang="ts">
    import { ref, inject } from "vue";
    import AccountGateway, { AccountGatewayHttp } from "./infra/gateway/AccountGateway";
    import SignupForm from "./domain/SignupForm";

    let form = ref(new SignupForm());

    const accountGateway = inject("accountGateway") as AccountGateway;

    form.value.register("confirmed", async (event) => {
        const output = await accountGateway.signup(event);
        form.value.accountId = output.accountId;
    });

</script>

<template>
    <div>
        <div>
            <span class="span-step" @click="form.fill()">{{ form.step }}</span>
        </div>
        <div>
            <span class="span-progress">{{ form.getProgress() }}%</span>
        </div>
        <div>
            <span class="span-error">{{ form.error }}</span>
        </div>
        <div>
            <span class="span-account-id">{{ form.accountId }}</span>
        </div>
        <div v-if="form.step === 1">
            <div>
                <input class="input-name" type="text" v-model="form.name" placeholder="Name"/>
            </div>
            <div>
                <input class="input-email" type="text" v-model="form.email" placeholder="Email"/>
            </div>
            <div>
                <input class="input-document" type="text" v-model="form.document" placeholder="Document"/>
            </div>
        </div>
        <div v-if="form.step === 2">
            <div>
                <input class="input-password" type="text" v-model="form.password" placeholder="Password"/>
            </div>
            <div>
                <input class="input-confirm-password" type="text" v-model="form.confirmPassword" placeholder="Confirm Password"/>
            </div>
        </div>
        <button v-if="form.step > 1" class="button-previous" @click="form.previous()">Previous</button>
        <button v-if="form.step === 1" class="button-next" @click="form.next()">Next</button>
        <button v-if="form.step > 1" class="button-confirm" @click="form.confirm()">Confirm</button>
    </div>
</template>

<style>
</style>
