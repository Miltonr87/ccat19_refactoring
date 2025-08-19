import { mount } from "@vue/test-utils";
import App from "../src/App.vue";
import { AccountGatewayFake, AccountGatewayHttp } from "../src/infra/gateway/AccountGateway";
import { AxiosAdapter, FetchAdapter } from "../src/infra/http/HttpClient";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

test("Should verify signup flow", async () => {
    const accountGateway = new AccountGatewayFake();
    const wrapper = mount(App, {
        global: {
            provide: {
                accountGateway
            }
        }
    });
    expect(wrapper.get(".span-step").text()).toBe("1");
    expect(wrapper.find(".input-name").exists()).toBe(true);
    expect(wrapper.find(".input-email").exists()).toBe(true);
    expect(wrapper.find(".input-document").exists()).toBe(true);
    expect(wrapper.find(".input-password").exists()).toBe(false);
    expect(wrapper.find(".input-confirm-password").exists()).toBe(false);
    expect(wrapper.find(".button-previous").exists()).toBe(false);
    expect(wrapper.find(".button-next").exists()).toBe(true);
    expect(wrapper.find(".button-confirm").exists()).toBe(false);
    expect(wrapper.get(".span-progress").text()).toBe("0%");
    await wrapper.get(".input-name").setValue("John Doe");
    expect(wrapper.get(".span-progress").text()).toBe("25%");
    await wrapper.get(".input-email").setValue("john.doe@gmail.com");
    expect(wrapper.get(".span-progress").text()).toBe("50%");
    await wrapper.get(".input-document").setValue("97456321558");
    expect(wrapper.get(".span-progress").text()).toBe("75%");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("2");
    expect(wrapper.find(".input-name").exists()).toBe(false);
    expect(wrapper.find(".input-email").exists()).toBe(false);
    expect(wrapper.find(".input-document").exists()).toBe(false);
    expect(wrapper.find(".input-password").exists()).toBe(true);
    expect(wrapper.find(".input-confirm-password").exists()).toBe(true);
    expect(wrapper.find(".button-previous").exists()).toBe(true);
    expect(wrapper.find(".button-next").exists()).toBe(false);
    expect(wrapper.find(".button-confirm").exists()).toBe(true);
    await wrapper.get(".input-password").setValue("asdQWE123");
    expect(wrapper.get(".span-progress").text()).toBe("75%");
    await wrapper.get(".input-confirm-password").setValue("asd");
    expect(wrapper.get(".span-progress").text()).toBe("75%");
    await wrapper.get(".input-confirm-password").setValue("asdQWE123");
    expect(wrapper.get(".span-progress").text()).toBe("100%");
    await wrapper.get(".button-previous").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("1");
});

test("Should verify signup error messages", async () => {
    const accountGateway = new AccountGatewayFake();
    const wrapper = mount(App, {
        global: {
            provide: {
                accountGateway
            }
        }
    });
    expect(wrapper.get(".span-step").text()).toBe("1");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("1");
    expect(wrapper.get(".span-error").text()).toBe("Invalid name");
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("1");
    expect(wrapper.get(".span-error").text()).toBe("Invalid email");
    await wrapper.get(".input-email").setValue("john.doe@gmail.com");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("1");
    expect(wrapper.get(".span-error").text()).toBe("Invalid document");
    await wrapper.get(".input-document").setValue("97456321558");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("2");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Invalid password");
    await wrapper.get(".input-password").setValue("asdQWE123");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Invalid confirm password");
    await wrapper.get(".input-confirm-password").setValue("asd");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Password and confirm password must match");
    await wrapper.get(".input-confirm-password").setValue("asdQWE123");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("");
});

test("Should integrate signup with backend", async () => {
    const accountGateway = new AccountGatewayHttp(new AxiosAdapter());
    const wrapper = mount(App, {
        global: {
            provide: {
                accountGateway
            }
        }
    });
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".input-email").setValue("john.doe@gmail.com");
    await wrapper.get(".input-document").setValue("97456321558");
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-password").setValue("asdQWE123");
    await wrapper.get(".input-confirm-password").setValue("asdQWE123");
    await wrapper.get(".button-confirm").trigger("click");
    await sleep(200);
    expect(wrapper.get(".span-account-id").text()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
});
