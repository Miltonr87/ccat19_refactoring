import SignupForm from "../src/domain/SignupForm";

test("Should verify signup flow", async () => {
    const form = new SignupForm();
    form.register("confirmed", async (event: any) => {
        expect(event.name).toBe("John Doe");
        expect(event.email).toBe("john.doe@gmail.com");
        expect(event.document).toBe("97456321558");
        expect(event.password).toBe("asdQWE123");
    });
    expect(form.step).toBe(1);
    expect(form.getProgress()).toBe(0);
    form.name = "John Doe";
    expect(form.getProgress()).toBe(25);
    form.email = "john.doe@gmail.com";
    expect(form.getProgress()).toBe(50);
    form.document = "97456321558";
    expect(form.getProgress()).toBe(75);
    form.next();
    expect(form.step).toBe(2);
    form.password = "asdQWE123";
    expect(form.getProgress()).toBe(75);
    form.confirmPassword = "asd";
    expect(form.getProgress()).toBe(75);
    form.confirmPassword = "asdQWE123";
    expect(form.getProgress()).toBe(100);
    form.confirm();
    form.previous();
    expect(form.step).toBe(1);
});